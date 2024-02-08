import { useRouter } from 'next/router';

const VerifyPage = () => {
  const router = useRouter();
  const { id } = router.query; // `id` sería "asdf" en URL de ejemplo

  return (
    <div>
      Verifying ID: {id}
    </div>
  );
};

export default VerifyPage;
