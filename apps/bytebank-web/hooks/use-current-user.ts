"use client";

import * as React from 'react';
import type { User } from '@supabase/supabase-js';

import { HTTPService } from '@fiap-tech-challenge/services';

import { AuthService } from '@bytebank/client/services/auth-service';

const httpService = new HTTPService();
const authService = new AuthService(httpService);

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
