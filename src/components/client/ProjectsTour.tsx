// @ts-nocheck
import { useState } from 'react';
import { Joyride, STATUS } from 'react-joyride';

interface Props {
  primaryColor?: string;
  run: boolean;
  onFinish: () => void;
}

export default function ProjectsTour({ primaryColor = '#D3002D', run, onFinish }: Props) {
  const [steps] = useState([
    {
      target: 'body',
      content: '¡Bienvenido a tu área de Proyectos! 🗂️ Aquí agrupamos todas tus solicitudes en "Tableros" para mantener tu producción organizada.',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '.tour-nuevo-tablero',
      content: 'Crea un nuevo tablero (ej. "Campaña Buen Fin 2026") para agrupar todas las piezas gráficas que vayas a pedirnos sobre ese tema.',
      placement: 'bottom',
    },
    {
      target: '.tour-buscador-tablero',
      content: 'Si tienes muchos proyectos, búscalo rápido aquí por su nombre.',
      placement: 'bottom',
    },
    {
      target: '.tour-tarjeta-tablero',
      content: 'Cada tarjeta es un tablero. Dale clic para entrar y ver el estatus de todos los entregables que viven adentro.',
      placement: 'top',
    }
  ]);

  const handleJoyrideEvent = (data: any) => { 
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      onFinish();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      showProgress={true}
      showSkipButton={true}
      onEvent={handleJoyrideEvent}
      options={{
        primaryColor: primaryColor,
        overlayColor: 'rgba(0, 0, 0, 0.75)', 
        zIndex: 1000,
      }}
      styles={{
        buttonNext: {
          backgroundColor: primaryColor,
          borderRadius: '8px',
          fontWeight: 'bold',
          padding: '10px 16px',
        },
        buttonBack: { color: '#6B7280', marginRight: '10px' },
        buttonSkip: { color: '#6B7280' },
        tooltip: { borderRadius: '12px', padding: '20px' }
      }}
      locale={{ back: 'Atrás', close: 'Cerrar', last: '¡Listo!', next: 'Siguiente', skip: 'Saltar' }}
    />
  );
}