"use client";

import * as React from 'react';
import type { User } from '@supabase/supabase-js';

import { AuthService } from '@bytebank/client/services/auth-service';

const authService = new AuthService();

export function useCurrentUser() {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    function fetchCurrentUser() {
      setLoading(true);

      authService.getCurrentUser().then((user) => {
        setUser(user);
        setLoading(false);
      });
    }

    fetchCurrentUser();
  }, [])

  return { user, loading }
}
