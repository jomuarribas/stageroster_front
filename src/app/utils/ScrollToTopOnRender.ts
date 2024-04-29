'use client'

import React, { useEffect } from 'react';

export default function ScrollToTopOnRender() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return null;
};