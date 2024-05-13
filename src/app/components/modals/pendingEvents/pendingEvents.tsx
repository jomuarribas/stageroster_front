import styles from './pendingEvents.module.css';

interface WarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PendingEvents: React.FC<WarningModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.pendingEvents}>
      <div>
        <a href="#pendingEvents">Tienes eventos pendientes por confirmar</a>
      </div>
      <span className="material-symbols-outlined">pan_tool_alt</span>
    </div>
  );
};

export default PendingEvents;
