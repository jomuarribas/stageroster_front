import EventsSection from './components/landing/EventsSecton/EventsSections';
import Footer from './components/landing/Footer/Footer';
import FormSection from './components/landing/FormSection/FormSection';
import GroupsSection from './components/landing/GroupsSection/GroupsSection';
import Nav_l from './components/landing/Nav/Nav_l';
import PersonalEventsSection from './components/landing/PersonalEventsSection/PersonalEventsSection';
import PrincipalSection from './components/landing/PrincipalSection/PrincipalSection';
import styles from './page.module.css';

export default function StageRosterApp() {
  return (
    <>
      <Nav_l />
      <main className={styles.landingContent}>
        <PrincipalSection />
        <GroupsSection />
        <EventsSection />
        <PersonalEventsSection />
        <FormSection />
      </main>
      <Footer />
    </>
  );
}
