export const getStaticProps = async () => {
  // Dateオブジェクトで渡せないため文字列に変換
  const initDate = new Date().toISOString();
  return {
    props: {
      initDate,
    },
  };
};
