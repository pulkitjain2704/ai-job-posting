/**
 * Unambiguous Hindi words in Roman script.
 * Their presence in any user message signals Hinglish mode.
 */
const HINDI_ROMAN_WORDS = new Set([
  'aap','ap','aapka','aapki','aapke','apka','apki','apke',
  'kya','hai','hain','tha','thi',
  'mein','hoon','hun',
  'nahi','nahin','nhi','nah',
  'hoga','hogi','honge','hoge',
  'chahiye','chahie','chaiye',
  'batao','bataiye','bataye','batana',
  'karo','karein','kijiye','karna','karte','karta','karti',
  'lagta','lagti','lagte',
  'agar','toh','woh','wo','yeh','ye',
  'aur','lekin','kyunki','isliye','phir','fir',
  'bahut','bohot','thoda','thodi',
  'accha','acha','theek','bilkul','zaroor','sirf',
  'saari','sara','poora','poori','sab','sabhi',
  'pehle','baad','abhi','jab','tab',
  'kahan','kab','kaun','kaisa','kaisi','kitna','kitni','kitne',
  'raha','rahi','rahe',
  'bolna','bolte','bolta','bolti',
  'paas','saath','liye','wala','wali','wale',
  'jaiye','jao','dijiye','lijiye',
  'samjhe','samajh','dekhiye','suniye',
  'milega','milegi','milenge',
  'dena','lena','aana','jaana',
  'teen','saal','hajar','rupay','rupee','mahina','mahiney',
  'mujhe','humein','unhe','inhe',
  'isko','uska','uski','uske','apna','apni','apne',
  'bhi','hi','toh','se','ko','ka','ki','ke',
]);

/**
 * Scan all user messages in the conversation history and return:
 *   'hinglish' — if any message contains ≥1 Hindi Roman word
 *   'english'  — if no Hindi words found anywhere
 *
 * @param {Array<{role: string, content: string}>} history  API conversation history
 * @returns {'english' | 'hinglish'}
 */
export function detectConversationLanguage(history) {
  for (const msg of history) {
    if (msg.role !== 'user') continue;
    const words = msg.content.toLowerCase().match(/[a-z]+/g) || [];
    const hasHindi = words.some((w) => HINDI_ROMAN_WORDS.has(w));
    if (hasHindi) return 'hinglish';
  }
  return 'english';
}
