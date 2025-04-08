import { Image } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function HSTitle({ title, canBack = false }: { title: string; canBack?: boolean }) {
  const navigate = useNavigate();
  return (
    <div className='relative w-full text-center pt-6 pb-4 mb-6'>
      {canBack && (
        <div className='absolute left-4 top-4 cursor-pointer'>
          <Image src='/back.svg' width={24} height={24} alt='back' onClick={() => navigate(-1)} />
        </div>
      )}
      <h2 className='text-xl'>{title}</h2>
    </div>
  );
}
