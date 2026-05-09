import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useVisualizer } from '@/store/visualizer';
import type { Step } from '@/lib/crypto/types';
import InputStage from './stages/InputStage';
import PaddingStage from './stages/PaddingStage';
import LengthAppendedStage from './stages/LengthAppendedStage';
import BlockSplitStage from './stages/BlockSplitStage';
import InitStage from './stages/InitStage';
import BlockStartStage from './stages/BlockStartStage';
import RoundStartStage from './stages/RoundStartStage';
import OperationStage from './stages/OperationStage';
import BlockEndStage from './stages/BlockEndStage';
import OutputStage from './stages/OutputStage';
import HmacInputStage from './hmac/HmacInputStage';
import HmacKeyPrepStage from './hmac/HmacKeyPrepStage';
import HmacXorStage from './hmac/HmacXorStage';
import HmacInnerStartStage from './hmac/HmacInnerStartStage';
import HmacOuterStartStage from './hmac/HmacOuterStartStage';
import HmacOutputStage from './hmac/HmacOutputStage';

export default function StageRouter() {
  const { visibleSteps, index, level } = useVisualizer();
  const current = useMemo(
    () => visibleSteps[Math.min(index, visibleSteps.length - 1)],
    [visibleSteps, index],
  );

  if (!current) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${index}-${current.kind}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ type: 'spring', stiffness: 220, damping: 28 }}
        className="w-full"
      >
        <StageFor step={current} level={level} />
      </motion.div>
    </AnimatePresence>
  );
}

function StageFor({ step, level }: { step: Step; level: import('@/lib/crypto/types').ExplanationLevel }) {
  switch (step.kind) {
    case 'input':
      return <InputStage step={step} level={level} />;
    case 'padding':
      return <PaddingStage step={step} level={level} />;
    case 'length-appended':
      return <LengthAppendedStage step={step} level={level} />;
    case 'block-split':
      return <BlockSplitStage step={step} level={level} />;
    case 'init':
      return <InitStage step={step} level={level} />;
    case 'block-start':
      return <BlockStartStage step={step} />;
    case 'round-start':
      return <RoundStartStage step={step} />;
    case 'operation':
      return <OperationStage step={step} level={level} />;
    case 'block-end':
      return <BlockEndStage step={step} />;
    case 'output':
      return <OutputStage step={step} />;
    case 'hmac-input':
      return <HmacInputStage step={step} />;
    case 'hmac-key-prep':
      return <HmacKeyPrepStage step={step} />;
    case 'hmac-xor':
      return <HmacXorStage step={step} />;
    case 'hmac-inner-start':
      return <HmacInnerStartStage step={step} />;
    case 'hmac-outer-start':
      return <HmacOuterStartStage step={step} />;
    case 'hmac-output':
      return <HmacOutputStage step={step} />;
  }
}
