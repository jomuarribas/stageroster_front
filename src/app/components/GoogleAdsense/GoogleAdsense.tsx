import Script from 'next/script';

const GoogleAdsense = () => {
  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8576972233268675"
      crossOrigin="anonymous"
    ></Script>
  );
};

export default GoogleAdsense;
