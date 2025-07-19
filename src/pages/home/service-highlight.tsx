import TransitionLink from '@/components/transition-link';
import { ReactNode } from 'react';
import { To } from 'react-router-dom';

function ServiceHighlight(props: {
  title: string;
  subtitle: string;
  cta?: ReactNode;
  image: string;
  className?: string;
  to: To;
}) {
  return (
    <TransitionLink
      className={'relative flex flex-col justify-end gap-3 bg-cover bg-center p-4 w-full h-full rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] '.concat(
        props.className ?? ''
      )}
      to={props.to}
      style={{ backgroundImage: `url(${props.image})` }}
    >
      <div className="absolute inset-0 bg-black/30 rounded-2xl pointer-events-none" />
      <div className="relative z-10">
        <div className="absolute inset-0 bg-black/40 rounded-2xl z-0" />
        <div className="relative z-10">
          <div
            className="title text-base font-bold mb-2 leading-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]"
            dangerouslySetInnerHTML={{ __html: props.title }}
          ></div>
          <div
            className="subtitle text-sm text-white line-clamp-2 leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]"
            dangerouslySetInnerHTML={{ __html: props.subtitle }}
          ></div>
        </div>
        {props.cta && <div className="mt-3">{props.cta}</div>}
      </div>
    </TransitionLink>
  );
}

export default ServiceHighlight;
