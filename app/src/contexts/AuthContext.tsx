const login = (user: DecodedToken, navigate?: (path: string) => void) => {
  setUser(user);
  localStorage.setItem('user', JSON.stringify(user));
  if (navigate) {
    navigate('/');
  }
}; 