const COMPARE_KEY = 'smartshopping_compare_ids';

export function getCompareIds() {
  try {
    const data = localStorage.getItem(COMPARE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
}

export function saveCompareIds(ids) {
  try {
    const cleanIds = Array.from(new Set(ids.map((id) => Number(id)).filter(Boolean)));
    localStorage.setItem(COMPARE_KEY, JSON.stringify(cleanIds));
    window.dispatchEvent(new CustomEvent('compareListChanged', { detail: cleanIds }));
  } catch (err) {
    console.error(err);
  }
}

export function addCompareId(id) {
  const current = getCompareIds();
  const numId = Number(id);
  if (current.includes(numId)) {
    return { success: true, ids: current, message: 'Already in compare list' };
  }
  if (current.length >= 4) {
    return { success: false, ids: current, message: 'You can compare up to 4 products at a time.' };
  }
  const updated = [...current, numId];
  saveCompareIds(updated);
  return { success: true, ids: updated, message: 'Added to compare list' };
}

export function removeCompareId(id) {
  const current = getCompareIds();
  const numId = Number(id);
  const updated = current.filter((i) => i !== numId);
  saveCompareIds(updated);
  return updated;
}

export function toggleCompareId(id) {
  const current = getCompareIds();
  const numId = Number(id);
  if (current.includes(numId)) {
    const updated = current.filter((i) => i !== numId);
    saveCompareIds(updated);
    return { isCompared: false, ids: updated, limitReached: false };
  } else {
    if (current.length >= 4) {
      alert('You can compare up to 4 products at a time.');
      return { isCompared: false, ids: current, limitReached: true };
    }
    const updated = [...current, numId];
    saveCompareIds(updated);
    return { isCompared: true, ids: updated, limitReached: false };
  }
}
