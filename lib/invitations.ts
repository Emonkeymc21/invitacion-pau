export type InvitationConfig = {
  slug: string;
  nombre: string;
  nickname: string;
  password: string;
  unlockAtArgentina: string;
  meetUrl: string;
  title: string;
  verse: string;
  verseRef: string;
};

export const invitations: Record<string, InvitationConfig> = {
  'pau-rodriguez': {
    slug: 'pau-rodriguez',
    nombre: 'Ana Paula Rodríguez',
    nickname: 'Pau',
    password: 'PAU2026',
    unlockAtArgentina: '2026-07-28T20:30:00-03:00', // Desbloqueo hoy 28/07/2026 a las 20:30 hs
    meetUrl: 'https://meet.google.com/tu-codigo-aqui',
    title: 'DISCERNIMIENTO Y LLAMADO AL SERVICIO',
    verse:
      '“No tomen como modelo a este mundo. Por el contrario, transfórmense interiormente renovando su mentalidad, a fin de que puedan discernir cuál es la voluntad de Dios: lo que es bueno, lo que le agrada, lo perfecto.”',
    verseRef: 'Romanos 12,2'
  },
  'ana-paula': {
    slug: 'ana-paula',
    nombre: 'Ana Paula Rodríguez',
    nickname: 'Pau',
    password: 'PAU2026',
    unlockAtArgentina: '2026-07-28T20:30:00-03:00',
    meetUrl: 'https://meet.google.com/tu-codigo-aqui',
    title: 'DISCERNIMIENTO Y LLAMADO AL SERVICIO',
    verse:
      '“No tomen como modelo a este mundo. Por el contrario, transfórmense interiormente renovando su mentalidad, a fin de que puedan discernir cuál es la voluntad de Dios: lo que es bueno, lo que le agrada, lo perfecto.”',
    verseRef: 'Romanos 12,2'
  }
};

export type InvitationContent = {
  intro: string[];
  objetivos: string[];
  actividades: string[];
  bloques: Array<{
    titulo: string;
    lema?: string;
    intro?: string;
    preguntas?: string[];
    nota?: string;
    oracion?: string[];
  }>;
  cierre: string[];
};

export const invitationContent: InvitationContent = {
  intro: [
    'Querida Pau: Dios no elige a los preparados, sino que prepara con amor a los elegidos. Jesús siempre nos invita a ponernos en marcha, a no quedarnos de brazos cruzados y a servir al prójimo que lo necesita, entregando con generosidad los carismas y dones que Él mismo sembró en tu corazón.',
    'Sabemos que Dios llama en los momentos justos y perfectos de la vida, ni antes ni después. Él nunca nos pide más de lo que podemos dar, pero cuando nos llama, nos invita a entregarlo todo con el alma, confiando en su gracia.',
    'Por tu compromiso sincero, tu escucha, tus convicciones profundas, tu capacidad de diálogo y tu hermoso carisma peregrino, Dios hoy toca a tu puerta. Queremos invitarte de todo corazón a que este año entregues lo mejor de vos en el EQUIPO DE COMUNIDAD.'
  ],
  objetivos: [
    'Formación espiritual de los peregrinos: velar con cariño y entrega por la Fe y la vida espiritual de cada uno.',
    'Educar al peregrino para que el movimiento sea un puente real hacia un crecimiento espiritual profundo y compartido.',
    'Acompañar cada encuentro para que tenga un momento verdadero de meditación, bajada a la realidad y aprendizaje que impulse a seguir caminando.',
    'Mantener actualizadas las charlas y espacios de escucha, atentos a las necesidades del peregrino y lo que la comunidad busca en cada tiempo.'
  ],
  actividades: [
    'Búsqueda y acompañamiento de charlistas: acompañarlos desde el cariño, transmitirles el sentido del encuentro y velar por sus necesidades.',
    'Preparación de material y preguntas para la meditación: preparar momentos profundos posteriores a cada charla para que cada peregrino pueda materializar lo escuchado.',
    'Guiar el encuentro de Comunidad: preparar el salón, armar el altar, cuidar los momentos, el clima de oración y el cierre de cada jornada.',
    'Misas Peregrinas: coordinar y convocar a los peregrinos para las lecturas, ofrendas y coro los terceros domingos de cada mes en la Pquia. Virgen Niña.'
  ],
  bloques: [
    {
      titulo: 'BLOQUE Nº1: DISPONER EL CORAZÓN',
      lema: '“No responder desde la emoción impulsiva, sino desde la oración sincera.”',
      intro: 'Pau, antes de dar un sí o un no, regalate un espacio de intimidad con Dios en este tiempo justo.',
      preguntas: [
        '¿Qué sintió tu corazón cuando leíste esta invitación? ¿Alegría? ¿Miedo? ¿Paz?',
        '¿Te estás dando el tiempo necesario para escuchar lo que Jesús te quiere decir?',
        '¿Estás dispuesta a confiar en que Dios te llama en el momento perfecto de tu vida?'
      ],
      nota: 'Recordá: El servicio no es una carga ni un privilegio, es un llamado de amor. Dios te sueña libre.',
      oracion: [
        'Señor, si este llamado para mi vida viene de Vos, regalame claridad y paz.',
        'Quita de mi corazón el miedo, las dudas o la presión.',
        'Que pueda responderte con libertad, amor y entrega total.',
        'Amén.'
      ]
    },
    {
      titulo: 'BLOQUE Nº2: MIRAR MI PROPIO CAMINO',
      lema: '“Primero soy hija y peregrina, después servidora.”',
      intro: 'Antes de pensar en todo lo que vas a entregar, mirá dónde estás parada hoy.',
      preguntas: [
        '¿Cómo está tu caminar de Fe en este tiempo?',
        '¿Sentís el deseo de dar lo mejor de vos para ayudar a que otros se encuentren con Dios?',
        '¿Qué te entusiasma y qué te da temor de entregarlo todo en este servicio?'
      ],
      nota: 'Un servidor no es el que todo lo sabe o ya llegó. Es quien sigue caminando y se deja abrazar por la gracia de Dios.'
    },
    {
      titulo: 'BLOQUE Nº3: DISCERNIR CON PAZ',
      lema: '“La paz profunda y humilde en el corazón suele ser la voz de Dios.” – San Ignacio',
      intro: 'Buscá esa paz serena que sólo Jesús sabe dar cuando nos pide dar un paso adelante.',
      preguntas: [
        'Cuando te imaginás sirviendo y entregando lo mejor de vos, ¿sentís paz en tu interior?',
        '¿Sentís que este llamado te ayuda a crecer en humildad y entrega a los demás?'
      ],
      nota: 'Buscá siempre la paz profunda y humilde, no la emoción pasajera.'
    },
    {
      titulo: 'BLOQUE Nº4: CONFIRMACIÓN',
      intro: 'Tómate el tiempo de rezarlo y conversarlo.',
      preguntas: [
        'Compartí lo que sientas en el corazón con los animadores.',
        'No tengas miedo de pedir el tiempo que necesites para escucharlo a Dios.',
        'Confía en que tu identidad principal es ser hija amada de Dios.'
      ],
      nota: 'Dios te conoce, sabe de lo que sos capaz y te invita a darlo todo con Él.'
    }
  ],
  cierre: [
    'ORACIÓN FINAL DE ENTREGA',
    'Espíritu Santo, si este es el lugar y el tiempo donde querés que entregue mi corazón, regalame disponibilidad, generosidad y valentía.',
    'Si este es mi momento, dame la fuerza para darlo todo con amor.',
    'Que mi respuesta nazca del deseo sincero de seguir tus pasos.',
    'Amén.',
    'CONTACTO DE LOS ANIMADORES DEL ÁREA DE COMUNIDAD'
  ]
};

export function getInvitationBySlug(slug: string) {
  return invitations[slug] ?? invitations['pau-rodriguez'];
}

export function validateInvitationPassword(slug: string, password: string) {
  const invitation = getInvitationBySlug(slug);
  if (!invitation) return false;
  return invitation.password.toUpperCase() === password.trim().toUpperCase();
}