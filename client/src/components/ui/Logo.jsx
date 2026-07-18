const LOGO_SRC = '/logo.png?v=2';

export default function Logo({ className = 'h-10 w-auto max-w-[200px] object-contain', alt = 'VDORT Services Pvt. Ltd.' }) {
  return <img src={LOGO_SRC} alt={alt} className={className} loading="eager" />;
}
