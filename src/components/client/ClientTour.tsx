// @ts-nocheck
import { useState } from 'react';
import { Joyride, STATUS } from 'react-joyride'; // 🔥 V3 usa esto entre llaves obligatoriamente

interface Props {
  primaryColor?: string;
  secondaryColor?: string;
  run: boolean;
  onFinish: () => void;
}

export default function ClientTour({ primaryColor = '#D3002D', secondaryColor = '#0F0F12', run, onFinish }: Props) {
  const [steps] = useState([
    {
      target: 'body',
      content: '¡Bienvenido a tu Portal Partner! 👋 Aquí centralizamos toda la producción creativa de tu cuenta. Vamos a dar un recorrido rápido.',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '.tour-nueva-solicitud',
      content: 'Pícale aquí cuando necesites un nuevo entregable. Llenas el brief, pones tu deadline, y nuestro equipo de operaciones arranca el pipeline.',
      placement: 'bottom',
    },
    {
      target: '.tour-metricas',
      content: 'Tus KPIs en tiempo real. Revisa al instante cuántas piezas estamos produciendo, cuáles necesitan tu aprobación y tu récord de terminados.',
      placement: 'bottom',
    },
    {
      target: '.tour-pipeline',
      content: 'Aquí abajo viven todas tus solicitudes activas. Puedes buscar, filtrar por prioridad o ver cuáles urgen más.',
      placement: 'top',
    },
    {
      target: '.tour-sidebar-proyectos',
      content: 'En esta sección puedes ver tus entregables agrupados por Proyectos/Campañas.',
      placement: 'right',
    },
    {
      target: '.tour-sidebar-config',
      content: 'Y por último, en configuración puedes actualizar tus datos de contacto y cambiar tu contraseña de acceso. ¡Estás listo para operar!',
      placement: 'right',
    }
  ]);

  // 🔥 V3 cambió la forma de recibir los eventos
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
      onEvent={handleJoyrideEvent} // 🔥 En V3 se llama onEvent (ya no es callback)
      options={{ // 🔥 En V3, options va suelto (ya no adentro de styles)
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
        last: '¡A darle!',
        next: 'Siguiente',
        skip: 'Saltar Tour',
      }}
    />
  );
}