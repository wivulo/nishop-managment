export function isLoggedIn(user) {
  if (user.username && user.password) {
    return true;
  } else {
    return false;
  }
}
