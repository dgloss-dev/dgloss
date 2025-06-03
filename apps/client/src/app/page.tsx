import React from 'react';
import { Button } from '@workspace/ui/components/atoms/button';

const Page = async () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>DGLOSS</h1>
      <Button>Click me</Button>
    </div>
  );
};

export default Page;
