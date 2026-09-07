// @ts-nocheck
import { useState } from 'react';
import { Joyride, STATUS } from 'react-joyride';

interface Props {
  primaryColor?: string;
  run: boolean;
  onFinish: () => void;
}

export default function ModalTour({ primaryColor = '#D3002D', run, onFinish }: Props) {
  const [steps] = useState([
    {
      target: '.tour-modal-proyecto',
      content: 'Primero, elige a qué Tablero o Proyecto pertenece esta solicitud. Si es algo nuevo, puedes crear un Tablero desde aquí mismo.',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '.tour-modal-info',
      content: 'Dale un título claro a tu solicitud y dinos de qué marca o departamento viene.',
      placement: 'bottom',
    },
    {
      target: '.tour-modal-specs',
      content: 'Selecciona el tipo de entregable que necesitas, tu fecha ideal de entrega, qué tan urgente es y cuántas piezas son.',
      placement: 'left',
    },
    {
      target: '.tour-modal-brief',
      content: '¡La parte más importante! Detalla exactamente qué necesitas: textos, medidas, objetivos, referencias... entre más claro, ¡más rápido te entregamos!',
      placement: 'top',
    },
    {
      target: '.tour-modal-enlaces',
      content: 'Si tienes archivos en Drive, referencias en Figma o una carpeta de Dropbox, pega aquí las ligas.',
      placement: 'top',
    },
    {
      target: '.tour-modal-enviar',
      content: 'Cuando todo esté listo, pícale aquí y tu solicitud volará directamente a nuestro equipo operativo. 🚀',
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
        zIndex: 100000, // 🔥 Un zIndex altísimo para que salga encima del modal
      }}
      styles={{
        buttonNext: {
          backgroundColor: primaryColor,
          borderRadius: '8px',
          fontWeight: 'bold',
          padding: '10px 16px',
        },
        buttonBack: {
          color: '#6B7280',
          marginRight: '10px',
        },
        buttonSkip: {
          color: '#6B7280',
        },
        tooltip: {
          borderRadius: '12px',
          padding: '20px',
        }
      }}
      locale={{
        back: 'Atrás',
        close: 'Cerrar',
        last: '¡Entendido!',
        next: 'Siguiente',
        skip: 'Saltar Tour',
      }}
    />
  );
}