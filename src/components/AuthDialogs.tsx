import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { X, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type AuthMode = 'signin' | 'signup';

interface AuthDialogsProps {
  mode?: AuthMode;
}

export function AuthDialogs({ mode: initialMode = 'signin' }: AuthDialogsProps) {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (mode === 'signin') {
        console.log('🔑 Attempting sign in...', email);
        const { error } = await signIn(email, password);
        if (error) {
          console.error('❌ Sign in error:', error);
          setError(error.message);
        } else {
          console.log('✅ Sign in successful! Navigating to dashboard...');
          setSuccessMessage('✅ Signed in successfully!');
          setTimeout(() => {
            setIsOpen(false);
            navigate('/dashboard');
          }, 1000);
        }
      } else {
        console.log('📝 Attempting sign up...', email);
        const result = await signUp(email, password, name);
        if (result.error) {
          console.error('❌ Sign up error:', result.error);
          setError(result.error.message);
        } else if (result.message) {
          console.log('📧 Email confirmation required');
          setSuccessMessage(`📧 ${result.message}`);
          // Don't auto-close if email confirmation is needed
        } else {
          console.log('✅ Sign up successful!');
          setSuccessMessage('✅ Account created successfully! You can now close this and sign in.');
          // Keep the success message visible, user can manually close the dialog
        }
      }
    } catch (err) {
      console.error('💥 Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <Button variant="outline" size="lg">
          {initialMode === 'signin' ? 'Sign In' : 'Sign Up'}
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
            zIndex: 9998 
          }}
        />
        <Dialog.Content 
          style={{
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '448px',
            zIndex: 9999,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
        >
          <Dialog.Title style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#111' }}>
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </Dialog.Title>
          <Dialog.Description style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
            {mode === 'signin' 
              ? 'Enter your credentials to access your account' 
              : 'Create a new account to get started'}
          </Dialog.Description>

          {error && (
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#fee', 
              color: '#c00', 
              borderRadius: '6px', 
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              ❌ {error}
            </div>
          )}

          {successMessage && (
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#efe', 
              color: '#060', 
              borderRadius: '6px', 
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {successMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {mode === 'signin' ? 'Signing In...' : 'Creating Account...'}
                  </>
                ) : (
                  mode === 'signin' ? 'Sign In' : 'Create Account'
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={toggleMode}
                className="text-sm"
              >
                {mode === 'signin'
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </Button>
            </div>
          </form>

          <Dialog.Close asChild>
            <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full p-1">
              <X className="w-5 h-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}