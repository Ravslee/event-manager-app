import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuth } from '../AuthContext';

describe('useAuth hook', () => {
  it('throws error when rendered outside AuthProvider', () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth must be used within an AuthProvider'
    );
  });
});
