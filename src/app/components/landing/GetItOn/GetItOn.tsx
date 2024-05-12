import Image from 'next/image';
import styles from './GetItOn.module.css';

export default function GetItOn() {
  return (
    <div className={styles.getItOn}>
      <h3>Disponible en:</h3>
      <div>
        <a
          href="https://play.google.com/store/apps"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/assets/googleplay.png"
            alt="Google Play"
            width={646}
            height={250}
            priority
          />
        </a>
        <a
          href="https://apps.apple.com/es/app/apple-store/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/assets/appstore.png"
            alt="App Store"
            width={498}
            height={167}
            priority
          />
        </a>
      </div>
    </div>
  );
}
