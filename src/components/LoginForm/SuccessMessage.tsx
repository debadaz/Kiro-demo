import styles from './SuccessMessage.module.css';

interface SuccessMessageProps {
  message: string;
}

export function SuccessMessage({ message }: SuccessMessageProps) {
  return <p className={styles.success}>{message}</p>;
}
