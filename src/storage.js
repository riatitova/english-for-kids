export function get(name) {
  return JSON.parse(window.localStorage.getItem(name));
}

export function set(name, value) {
  window.localStorage.setItem(name, JSON.stringify(value));
}
