import { useEffect, useMemo, useState } from 'react';
import { useVisualizer } from '@/store/visualizer';

function normalize(value: string) {
  return value
    .toLowerCase()
    .replaceAll('0x', '')
    .replace(/\s+/g, ' ')
    .trim();
}

function charToHex(char: string) {
  return new TextEncoder()
    .encode(char)
    .reduce((acc, byte) => [...acc, byte.toString(16).padStart(2, '0')], [] as string[])
    .join(' ');
}

function getMd5Words(text: string) {
  const bytes = Array.from(new TextEncoder().encode(text));
  const bitLength = bytes.length * 8;

  bytes.push(0x80);

  while (bytes.length % 64 !== 56) {
    bytes.push(0);
  }

  const lenBytes = new Uint8Array(8);
  new DataView(lenBytes.buffer).setBigUint64(0, BigInt(bitLength), true);
  bytes.push(...Array.from(lenBytes));

  const words: string[] = [];

  for (let i = 0; i < 64; i += 4) {
    const word =
      bytes[i] |
      (bytes[i + 1] << 8) |
      (bytes[i + 2] << 16) |
      (bytes[i + 3] << 24);

    words.push((word >>> 0).toString(16).padStart(8, '0'));
  }

  return words;
}

export default function InteractiveTask() {
  const { index, text, completedSteps, completeCurrentStep } = useVisualizer();

  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [showHint, setShowHint] = useState(false);

  const [matches, setMatches] = useState<Record<string, string>>({
    M0: '',
    M1: '',
    M14: '',
  });

  const task = useMemo(() => {
    if (index === 0 && text.length > 0) {
      const lastChar = text[text.length - 1];

      return {
        question: `Найдите hex-код последнего символа текста: "${lastChar}"`,
        answer: charToHex(lastChar),
        hint: `Символ "${lastChar}" нужно перевести в ASCII/UTF-8 hex.`,
      };
    }

    if (index === 2) {
      const bitLength = new TextEncoder().encode(text).length * 8;
      const hex = bitLength.toString(16).padStart(2, '0');
      const bytes = [hex, '00', '00', '00', '00', '00', '00', '00'];

      return {
        question: `Переведите длину сообщения (${bitLength} бит) в hex (little-endian)`,
        answer: bytes.join(' '),
        hint: `${bitLength} (dec) = ${hex} (hex), затем дополняется нулями до 8 байт.`,
      };
    }

    return null;
  }, [index, text]);

  useEffect(() => {
    setAnswer('');
    setResult(null);
    setShowHint(false);
    setMatches({ M0: '', M1: '', M14: '' });
  }, [index]);
   

  if (index === 1) {
    const isCompleted = completedSteps.includes(index);

    return (
      <div className="rounded-2xl border border-border bg-bg-panel/60 p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-accent-cyan">
            Шаг без задания
          </h3>

          {isCompleted && (
            <span className="text-xs text-green-400">
              Прочитано
            </span>
          )}
        </div>

        <p className="text-sm text-fg-muted">
          Прочитайте объяснение этого шага. Когда всё понятно — нажмите кнопку.
        </p>

        <button
          type="button"
          onClick={completeCurrentStep}
          disabled={isCompleted}
          className="rounded-xl border border-accent-cyan/50 bg-accent-cyan/10 px-4 py-2 text-sm text-accent-cyan transition disabled:opacity-40"
        >
          Done
        </button>
      </div>
    );
  }

  if (index === 3) {
    const isCompleted = completedSteps.includes(index);
    const words = getMd5Words(text);

    const correctMatches = {
      M0: words[0],
      M1: words[1],
      M14: words[14],
    };

    const options = shuffle([
        words[0],
        words[1],
        words[14],
        words[15],
        '00000000',
    ]);

    function checkMatching() {
      const correct =
        matches.M0 === correctMatches.M0 &&
        matches.M1 === correctMatches.M1 &&
        matches.M14 === correctMatches.M14;

      if (correct) {
        setResult('correct');
        completeCurrentStep();
      } else {
        setResult('wrong');
      }
    }

    return (
      <div className="rounded-2xl border border-border bg-bg-panel/60 p-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-accent-cyan">
            Matching: блоки MD5
          </h3>

          {isCompleted && (
            <span className="text-xs text-green-400">
              Пройдено
            </span>
          )}
        </div>

        <p className="text-sm text-fg-muted">
          Соотнесите слова MD5 с правильными 32-битными значениями.
        </p>

        <div className="grid gap-3 md:grid-cols-3">
          {(['M0', 'M1', 'M14'] as const).map((label) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-bg-soft p-3 space-y-2"
            >
              <div className="text-sm font-mono text-accent-amber">
                {label}
              </div>

              <select
                value={matches[label]}
                disabled={isCompleted}
                onChange={(e) => {
                  setMatches((prev) => ({
                    ...prev,
                    [label]: e.target.value,
                  }));
                  setResult(null);
                }}
                className="w-full rounded-lg border border-border bg-bg-panel px-3 py-2 text-sm outline-none"
              >
                <option value="">Выберите ответ</option>

                {options.map((option, i) => (
                  <option key={`${option}-${i}`} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={checkMatching}
          disabled={isCompleted || !matches.M0 || !matches.M1 || !matches.M14}
          className="rounded-xl border border-accent-cyan/50 bg-accent-cyan/10 px-4 py-2 text-sm text-accent-cyan transition disabled:opacity-40"
        >
          Проверить
        </button>

        {result === 'correct' && (
          <p className="text-sm text-green-400">
            Правильно. Следующий шаг открыт.
          </p>
        )}

        {result === 'wrong' && (
          <p className="text-sm text-red-400">
            Неправильно. Проверьте соответствия ещё раз.
          </p>
        )}
      </div>
    );
  }
  
  if (!task) {
    const isCompleted = completedSteps.includes(index);

    return (
        <div className="rounded-2xl border border-border bg-bg-panel/60 p-4 space-y-3">
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-accent-cyan">
            Шаг без задания
            </h3>

            {isCompleted && (
            <span className="text-xs text-green-400">
                Прочитано
            </span>
            )}
        </div>

        <p className="text-sm text-fg-muted">
            Ознакомьтесь с этим шагом и нажмите кнопку, чтобы продолжить.
        </p>

        <button
            type="button"
            onClick={completeCurrentStep}
            disabled={isCompleted}
            className="rounded-xl border border-accent-cyan/50 bg-accent-cyan/10 px-4 py-2 text-sm text-accent-cyan transition disabled:opacity-40"
        >
            Done
        </button>
        </div>
    );
    }

  const isCompleted = completedSteps.includes(index);

  function checkAnswer() {
    if (!task) return;

    if (normalize(answer) === normalize(task.answer)) {
      setResult('correct');
      completeCurrentStep();
    } else {
      setResult('wrong');
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-bg-panel/60 p-4">
      <div className="grid gap-4 md:grid-cols-[1.55fr_minmax(240px,0.85fr)]">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-accent-cyan">
              Интерактивное задание
            </h3>

            {isCompleted && (
              <span className="text-xs text-green-400">
                Пройдено
              </span>
            )}
          </div>

          <p className="text-sm text-fg-muted">
            {task.question}
          </p>

          <input
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setResult(null);
            }}
            placeholder="Напиши ответ"
            disabled={isCompleted}
            className="w-full rounded-xl border border-border bg-bg-soft px-3 py-2 text-sm outline-none focus:border-accent-cyan disabled:opacity-50"
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={checkAnswer}
              disabled={isCompleted || answer.trim().length === 0}
              className="rounded-xl border border-accent-cyan/50 bg-accent-cyan/10 px-4 py-2 text-sm text-accent-cyan transition disabled:opacity-40"
            >
              Проверить
            </button>

            <button
              type="button"
              onClick={() => setShowHint(true)}
              className="rounded-xl border border-border px-4 py-2 text-sm text-fg-muted transition hover:text-fg"
            >
              Подсказка
            </button>
          </div>

          {result === 'correct' && (
            <p className="text-sm text-green-400">
              Правильно. Следующий шаг открыт.
            </p>
          )}

          {result === 'wrong' && (
            <p className="text-sm text-red-400">
              Неправильно. Попробуйте ещё раз.
            </p>
          )}
        </div>

        <aside className="rounded-2xl border border-border bg-bg-soft/80 p-4 text-sm text-fg-muted space-y-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
              Что мы сделали
            </div>
            <p className="mt-2 text-[13px] leading-6 text-fg">
              Ранее мы уже преобразовали текст в байты. Теперь осталось найти hex-код последнего символа и ввести его в поле ответа.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-bg-panel/70 p-3 text-[13px] text-fg">
            <div className="font-semibold text-fg">Инструкция</div>
            <ol className="mt-3 list-decimal list-inside space-y-2 text-fg-muted">
              <li>Посмотри на последний символ текста.</li>
              <li>Переведи этот символ в байт (ASCII/UTF-8).</li>
              <li>Запиши полученный байт в hex.
              </li>
            </ol>
          </div>
        </aside>
        {showHint && (
          <p className="text-xs text-fg-subtle mt-3">
            {task.hint}
          </p>
        )}
      </div>
    </div>
  );
}

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}