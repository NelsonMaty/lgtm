import { callGemini } from './gemini.js';
import { promptStepNavigation, interactiveQA } from './interactive.js';
import { clearScreen, printHeader, printSuccess, printError, printAIResponse, createSpinner } from './ui.js';

import * as step1 from './prompts/step1-summary.js';
import * as step2 from './prompts/step2-nomenclature.js';
import * as step3 from './prompts/step3-logic.js';
import * as step4 from './prompts/step4-tests.js';
import * as step5 from './prompts/step5-ux.js';

const REVIEW_STEPS = [
  { module: step1, number: 1 },
  { module: step2, number: 2 },
  { module: step3, number: 3 },
  { module: step4, number: 4 },
  { module: step5, number: 5 },
];

/**
 * Execute a single review step
 */
async function executeStep(stepModule, context, mergeBase, apiKey, previousSteps) {
  const { STEP_TITLE, buildPrompt } = stepModule;
  
  clearScreen();
  printHeader(STEP_TITLE, stepModule.number || 0, REVIEW_STEPS.length);
  
  const prompt = buildPrompt(context, mergeBase, previousSteps);
  
  const spinner = createSpinner('Analyzing code...');
  spinner.start();
  
  const response = await callGemini(apiKey, prompt);
  spinner.stop();
  
  console.log();
  printAIResponse(response);
  
  return {
    title: STEP_TITLE,
    response: response,
    prompt: prompt
  };
}

/**
 * Main interactive review flow
 */
export async function runInteractiveReview(context, mergeBase, apiKey) {
  const completedSteps = [];
  let currentStepIndex = 0;
  let justFinishedQA = false; // Track if we just exited Q&A
  
  while (currentStepIndex < REVIEW_STEPS.length) {
    const step = REVIEW_STEPS[currentStepIndex];
    
    try {
      // Only execute step if we didn't just finish Q&A
      if (!justFinishedQA) {
        const stepResult = await executeStep(
          step.module,
          context,
          mergeBase,
          apiKey,
          completedSteps.slice(-2)
        );
        
        stepResult.number = step.number;
        completedSteps.push(stepResult);
      }
      
      // Reset Q&A flag
      justFinishedQA = false;
      
      const nextStepIndex = currentStepIndex + 1;
      const nextStepTitle = nextStepIndex < REVIEW_STEPS.length 
        ? `Step ${REVIEW_STEPS[nextStepIndex].number}: ${REVIEW_STEPS[nextStepIndex].module.STEP_TITLE}`
        : null;
      
      const navigation = await promptStepNavigation(
        step.number,
        REVIEW_STEPS.length,
        nextStepTitle
      );
      
      if (navigation.action === 'continue') {
        currentStepIndex++;
      } else if (navigation.action === 'ask') {
        const lastStep = completedSteps[completedSteps.length - 1];
        await interactiveQA(
          context,
          lastStep.title,
          lastStep.response,
          callGemini,
          apiKey
        );
        // Set flag so we don't re-execute the step
        justFinishedQA = true;
        // Stay on same index, loop will show navigation again
      } else if (navigation.action === 'skip') {
        currentStepIndex += 2;
        console.log(`\n⏭️  Skipping ${nextStepTitle}...\n`);
      } else if (navigation.action === 'quit') {
        clearScreen();
        printHeader('Review Stopped');
        console.log(`Completed ${completedSteps.length} of ${REVIEW_STEPS.length} steps.\n`);
        break;
      }
      
    } catch (error) {
      printError(`Error in ${step.module.STEP_TITLE}: ${error.message}`);
      
      if (error.message.includes('401') || error.message.includes('403')) {
        console.error('   Authentication error. Please check your API key.');
      } else if (error.message.includes('429')) {
        console.error('   Rate limit exceeded. Please try again later.');
      }
      
      console.log('\n   Continuing to next step...\n');
      await new Promise(resolve => setTimeout(resolve, 2000));
      currentStepIndex++;
    }
  }
  
  if (currentStepIndex >= REVIEW_STEPS.length) {
    clearScreen();
    printHeader('Review Complete');
    printSuccess('All steps completed!\n');
  }
}
