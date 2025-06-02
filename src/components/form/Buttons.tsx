'use client'

import { ReloadIcon } from '@radix-ui/react-icons';
import { useFormStatus } from 'react-dom';
import { LuTrash2, LuSquare } from 'react-icons/lu';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

type btnSize = 'lg' | 'default' | 'sm';

type SubmitButtonProps = {
  className?: string;
  text?: string;
  size?: btnSize;
};

export default function Buttons({className = '', text = 'submit', size = 'lg',
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return(
     <Button
      type='submit'
      disabled={pending}
      className={cn('capitalize', className)}
      size={size}
    >
      {pending ? (
        <>
          <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
          Please wait...
        </>
      ) : (
        text
      )}
    </Button>
  );
}

type ActionType = 'edit' | 'delete';

export const IconButton = ({actionType}: {actionType: ActionType}) => {
  const { pending } = useFormStatus();

  const rednerIcon = () => {
     switch (actionType) {
      case 'edit':
        return <LuSquare/>
      case 'delete':
        return <LuTrash2/>
      default:
        const never:never = actionType;
        throw new Error(`Invalid action type: ${never}`);
     }
  };

  return <Button type='submit' size='icon' variant='link' className='p-2 cursor-pointer'>
    {pending ? <ReloadIcon className='animate-spin'/> : rednerIcon()
    }
  </Button>
};
