import { useEffect } from 'react';

export const OAuhtSuccess = () => {
  useEffect(() => {
    const authChannel = new BroadcastChannel('auth_status');
    authChannel.postMessage('OAUTH_DONE');

    window.close();
  }, []);

  return (
    <div>Login Successful! bye...</div>
  )
}
