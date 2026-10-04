'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Profile, UserRole, StudentWithClass } from '@gyansthali/api-types';
import { mockProfiles, mockStudents } from '@/data/mockData';

interface RoleSessionContextType {
  role: UserRole;
  profile: Profile;
  setRole: (r: UserRole) => void;
  activeChild: StudentWithClass;
  setActiveChildId: (id: string) => void;
  parentChildren: StudentWithClass[];
}

const RoleSessionContext = createContext<RoleSessionContextType | undefined>(undefined);

export function RoleSessionProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('parent');
  const [profile, setProfile] = useState<Profile>(mockProfiles.parent);
  
  // Parent children (Aarav & Ananya)
  const parentChildren = [mockStudents[0], mockStudents[1]];
  const [activeChildId, setActiveChildIdState] = useState<string>(mockStudents[0].id);

  useEffect(() => {
    const savedRole = localStorage.getItem('gyansthali_role') as UserRole | null;
    if (savedRole && mockProfiles[savedRole]) {
      setRoleState(savedRole);
      setProfile(mockProfiles[savedRole]);
    }
  }, []);

  const setRole = (r: UserRole) => {
    setRoleState(r);
    setProfile(mockProfiles[r] || mockProfiles.parent);
    localStorage.setItem('gyansthali_role', r);
  };

  const setActiveChildId = (id: string) => {
    setActiveChildIdState(id);
  };

  const activeChild = parentChildren.find((c) => c.id === activeChildId) || parentChildren[0];

  return (
    <RoleSessionContext.Provider
      value={{
        role,
        profile,
        setRole,
        activeChild,
        setActiveChildId,
        parentChildren,
      }}
    >
      {children}
    </RoleSessionContext.Provider>
  );
}

export function useRoleSession() {
  const context = useContext(RoleSessionContext);
  if (!context) {
    throw new Error('useRoleSession must be used within RoleSessionProvider');
  }
  return context;
}
