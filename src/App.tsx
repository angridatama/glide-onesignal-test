import { useEffect, useState } from 'react';
import OneSignal from 'react-onesignal';

const App: React.FC = () => {
  // Defining the types for state
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('test@example.com'); // Replace with dynamic input if needed
  const [status, setStatus] = useState<string>('Initializing...');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const initOneSignal = async () => {
      try {
        // Initialize OneSignal with the appropriate app ID
        await OneSignal.init({
          appId: 'YOUR-ONESIGNAL-APP-ID', // Replace with your actual app ID
          serviceWorkerPath: 'OneSignalSDK.sw.js',
          notifyButton: {
            enable: true,
          },
        });

        setStatus('OneSignal initialized');

        // Log the user in using their email (setExternalUserId has been replaced)
        await OneSignal.login(email);
        setStatus(`Logged in as ${email}`);

        // Request native browser notification permission
        const permission = await OneSignal.Notifications.requestPermission();
        setStatus(`Permission status: ${permission}`);

        // Get Player ID and Push Token from OneSignal
        const pushId = OneSignal.User.PushSubscription.id;
        const pushToken = OneSignal.User.PushSubscription.token;

        setPlayerId(pushId || null);
        setToken(pushToken || null);

        console.log('User ID (Player ID):', pushId);
        console.log('Push Token:', pushToken);
      } catch (error) {
        console.error('OneSignal setup error:', error);
        setStatus('Error initializing OneSignal');
      }
    };

    initOneSignal();

    // Listen to changes in the subscription
    const handleSubscriptionChange = (event: any) => {
      console.log('Subscription changed:', event);
      setPlayerId(OneSignal.User.PushSubscription.id || null);
      setToken(OneSignal.User.PushSubscription.token || null);
    };

    OneSignal.User.PushSubscription.addEventListener('change', handleSubscriptionChange);

    return () => {
      OneSignal.User.PushSubscription.removeEventListener('change', handleSubscriptionChange);
    };
  }, [email]);

  const handleLogout = async () => {
    await OneSignal.logout();
    setStatus('Logged out');
    setPlayerId(null);
    setToken(null);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Push Notification Demo (OneSignal v16)</h1>
      <p><strong>Status:</strong> {status}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Player ID:</strong> {playerId || 'Not subscribed'}</p>
      <p><strong>Push Token:</strong> {token || 'Not available'}</p>
      <button onClick={handleLogout} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
        Logout from OneSignal
      </button>
    </div>
  );
};

export default App;
