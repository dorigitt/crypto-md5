import type { ExplanationLevel, HashMode, Step } from '@/lib/crypto/types';

export interface StepCommentary {
  titleRu: string;
  whatRu: string;
  whyRu?: string;
}

export function commentaryForStep(
  step: Step,
  level: ExplanationLevel,
  _mode: HashMode,
): StepCommentary {
  switch (step.kind) {
    case 'input': {
      const ctx = step.context;
      const ctxLabel =
        ctx === 'plain'
          ? 'сообщение'
          : ctx === 'hmac-inner'
            ? 'вход внутреннего MD5 в HMAC: (K ⊕ ipad) ∥ сообщение'
            : ctx === 'hmac-outer'
              ? 'вход внешнего MD5 в HMAC: (K ⊕ opad) ∥ inner_digest'
              : 'длинный ключ, который предварительно хешируется';
      return {
        titleRu: 'Вход',
        whatRu: `Сейчас на вход подаётся ${ctxLabel}. Длина: ${step.bytes.length} байт = ${step.bytes.length * 8} бит.`,
        whyRu:
          level === 'easy'
            ? 'MD5 принимает любую последовательность байтов и выдаёт 128 бит фиксированной длины — это и есть свойство хеш-функции.'
            : 'Текст UTF-8 кодируется в байты. MD5 не знает о символах — она работает только с битами.',
      };
    }
    case 'padding':
      return {
        titleRu: 'Дополнение (padding)',
        whatRu: `К сообщению дописывается бит «1» (= байт 0x80), затем нули до длины, кратной 64 байтам минус 8. Добавлено ${step.paddingBytesAdded} байт.`,
        whyRu:
          'MD5 работает блоками по 512 бит (64 байта). Последние 8 байт блока резервируются под длину исходного сообщения — отсюда «минус 8».',
      };
    case 'length-appended':
      return {
        titleRu: 'Добавление длины',
        whatRu: `В последние 8 байт записывается исходная длина в битах (${step.originalLenBits}) в little-endian порядке.`,
        whyRu:
          'Это защита от атаки extension: длина становится частью входа MD5, и изменить её незаметно невозможно.',
      };
    case 'block-split':
      return {
        titleRu: 'Разбиение на блоки',
        whatRu: `Получилось ${step.blockCount} блок${step.blockCount === 1 ? '' : 'ов'} по 512 бит. Каждый блок = 16 слов по 32 бита.`,
        whyRu:
          'Merkle-Damgård конструкция обрабатывает блоки последовательно: выход одного блока становится «состоянием» для следующего.',
      };
    case 'init':
      return {
        titleRu: 'Инициализация буферов',
        whatRu:
          'Четыре 32-битных регистра A, B, C, D заполняются магическими константами (0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476).',
        whyRu:
          'Эти значения фиксированы в стандарте RFC 1321. Они подобраны так, чтобы не было очевидных структурных свойств, упрощающих атаку.',
      };
    case 'block-start':
      return {
        titleRu: `Блок ${step.blockIndex + 1} из ${step.blockCount}`,
        whatRu:
          'Начинаем обрабатывать очередной 512-битный блок. Текущее состояние буферов запоминается — в конце блока мы его прибавим к результату.',
        whyRu:
          'Суммирование в конце — сердце Merkle-Damgård: «склеиваем» обработанный блок с накопленным состоянием.',
      };
    case 'round-start': {
      const descriptions: Record<0 | 1 | 2 | 3, string> = {
        0: 'F(B,C,D) = (B ∧ C) ∨ (¬B ∧ D) — «если B то C, иначе D». Похоже на мультиплексор.',
        1: 'G(B,C,D) = (B ∧ D) ∨ (C ∧ ¬D) — другой мультиплексор с переставленными входами.',
        2: 'H(B,C,D) = B ⊕ C ⊕ D — чистый XOR всех трёх регистров. Симметричная функция.',
        3: 'I(B,C,D) = C ⊕ (B ∨ ¬D) — самая хитрая, смешивает OR, NOT и XOR.',
      };
      return {
        titleRu: `Раунд ${step.roundIndex + 1} (${step.roundName})`,
        whatRu: descriptions[step.roundIndex],
        whyRu:
          'Четыре разных нелинейных функции, применённых по очереди, создают «лавинный эффект»: один бит входа влияет на множество бит выхода.',
      };
    }
    case 'operation':
      return {
        titleRu: `Операция ${step.opIndex + 1} из 64 (${step.funcName})`,
        whatRu: `b′ = b + rot(f(b,c,d) + a + K[${step.opIndex}] + M[${step.mIndex}], ${step.s}). Регистры сдвигаются: A←D, D←C, C←B, B←b′.`,
        whyRu:
          'Каждая операция: прибавляем нелинейную функцию, константу K, слово сообщения M, вращаем — и получаем новое B. Это даёт диффузию и нелинейность одновременно.',
      };
    case 'block-end':
      return {
        titleRu: 'Конец блока',
        whatRu:
          'К стартовому состоянию этого блока прибавляем итог 64 операций (по модулю 2^32). Это и есть новое глобальное состояние хеша.',
        whyRu:
          'Именно сложение (а не замена) делает конструкцию Merkle-Damgård — нельзя «откатить» блок, не зная его содержимого.',
      };
    case 'output':
      return {
        titleRu: 'Финальный хеш',
        whatRu: `Буферы A, B, C, D сериализуются little-endian → 16 байт (128 бит) → ${step.hashHex}.`,
        whyRu:
          'Выход фиксированной длины — ключевое свойство хеш-функции: сжимаем произвольный вход до 128 бит.',
      };

    case 'hmac-input':
      return {
        titleRu: 'HMAC: старт',
        whatRu: `Текст (${step.textBytes.length} байт) и ключ (${step.keyBytes.length} байт). HMAC-MD5 = MD5((K⊕opad) ∥ MD5((K⊕ipad) ∥ m)).`,
        whyRu:
          'Хеш сам по себе не защищён от подделки при известном тексте — нужна «приправа» секретом. HMAC — каноничный способ это делать.',
      };
    case 'hmac-key-prep': {
      const actions = {
        unchanged: 'Длина ключа равна размеру блока (64 байта) — используем как есть.',
        padded: 'Ключ короче 64 байт — дополняем нулями до 64 байт.',
        'hashed-and-padded':
          'Ключ длиннее 64 байт — сначала сжимаем его MD5 до 16 байт, потом дополняем нулями до 64 байт.',
      };
      return {
        titleRu: 'Подготовка ключа',
        whatRu: actions[step.action],
        whyRu:
          'HMAC требует ключ ровно в размер блока MD5. Это нормализует ключ независимо от того, какой длины пользователь его передал.',
      };
    }
    case 'hmac-xor':
      return {
        titleRu: `XOR ключа с ${step.pad === 'ipad' ? 'ipad (0x36)' : 'opad (0x5C)'}`,
        whatRu: `Каждый байт подготовленного ключа XOR-ится с байтом 0x${step.padValue.toString(16).toUpperCase()} — получаем K⊕${step.pad}.`,
        whyRu:
          step.pad === 'ipad'
            ? 'ipad «окрашивает» ключ для внутреннего прохода. Вместе с opad гарантирует, что внутренний и внешний MD5 идут с разными эффективными ключами.'
            : 'opad задаёт второй, отличающийся от ipad ключ для внешнего прохода. 0x36 ⊕ 0x5C = 0x6A — высокий Хэмминговский вес.',
      };
    case 'hmac-inner-start':
      return {
        titleRu: 'Внутренний MD5',
        whatRu: `Хешируем (K⊕ipad) ∥ сообщение — итого ${step.innerInput.length} байт. Это ровно 1 блок заголовка + блоки сообщения.`,
        whyRu:
          'Внутренний MD5 получает «солёный ключом» вход. Даже если атакующий знает сообщение, без ключа он не получит тот же промежуточный результат.',
      };
    case 'hmac-outer-start':
      return {
        titleRu: 'Внешний MD5',
        whatRu: `Хешируем (K⊕opad) ∥ inner_digest — итого ${step.outerInput.length} байт (1 блок заголовка + 16 байт внутреннего результата).`,
        whyRu:
          'Внешний проход «запечатывает» результат: атакующий, даже построив коллизию для внутреннего MD5, не получит валидный HMAC, потому что ему ещё нужно пройти внешний проход с другим ключом.',
      };
    case 'hmac-output':
      return {
        titleRu: 'Финальный HMAC',
        whatRu: `Результат внешнего MD5 = ${step.macHex}. Длина — 16 байт, как у обычного MD5.`,
        whyRu:
          'HMAC-MD5 выдаёт тот же размер выхода, что и MD5, но в отличие от MD5 — привязан к секретному ключу. Это делает его MAC, а не просто хешем.',
      };
  }
}
