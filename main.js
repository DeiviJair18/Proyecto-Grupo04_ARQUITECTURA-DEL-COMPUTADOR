// Conexión al broker MQTT con HiveMQ Cloud
const client = mqtt.connect('wss://ba964ce91b284077817e1579c91b2470.s1.eu.hivemq.cloud:8884/mqtt', {
  username: 'Jair18',
  password: 'Amen100%'
});

// Conexión exitosa
client.on('connect', () => {
  console.log('Conectado al servidor MQTT');
  client.subscribe('sensores/distancia');
  client.subscribe('sensores/neoestado');
  client.subscribe('sensores/sonido');
  client.subscribe('sensores/flama');
  client.subscribe('manejobuzzer');
});

// Manejo de mensajes MQTT
client.on('message', (topic, message) => {
  const value = message.toString();

  if (topic === 'sensores/distancia') {
    // Manejo del sensor de distancia
    const distance = parseInt(value, 10);
    document.getElementById('distance-value').textContent = `${distance} cm`;
    const progressBar = document.getElementById('distance-bar');
    progressBar.style.width = `${Math.min((distance / 100) * 100, 100)}%`;
    progressBar.style.backgroundColor = distance <= 15 ? 'red' : 'black';

        // Mostrar notificación si la distancia es 25 cm o menos
    const notification = document.getElementById('notification');
    if (distance <= 25) {
      notification.textContent = '¡BEBE ABORDO DE LA CAMA, PELIGRO!';
      notification.style.display = 'block'; // Muestra la notificación
    } else {
      notification.style.display = 'none'; // Oculta la notificación
    }

  } else if (topic === 'sensores/sonido') {
    // Manejo del NeoPixel
    const neopixel = document.getElementById('neopixel');
    neopixel.className = value === 'Detectado' ? 'led red' : 'led green';

    // Manejo de los íconos
    const noiseIcon = document.getElementById('noise-icon');
    if (value === 'Detectado') {
      noiseIcon.innerHTML = '<i class="bi bi-volume-up-fill"></i>'; // Ícono de sonido detectado
      noiseIcon.classList.add('active');
      noiseIcon.classList.remove('inactive');
    } else {
      noiseIcon.innerHTML = '<i class="bi bi-mic-mute-fill"></i>'; // Ícono de sonido no detectado
      noiseIcon.classList.add('inactive');
      noiseIcon.classList.remove('active');
    }

  } else if (topic === 'sensores/flama') {
    // Manejo del sensor de flama
    const flameStatus = document.getElementById('flame-value');
    const flameIcon = document.getElementById('flame-icon');
    flameStatus.textContent = value === 'Detectada' ? '¡Fuego detectado!' : 'Sin fuego detectado';
    flameStatus.style.color = value === 'Detectada' ? 'red' : 'green';
    flameIcon.className = value === 'Detectada' ? 'flame-icon on' : 'flame-icon off';
  }
});

// Botones del buzzer
document.getElementById('buzzer-on').addEventListener('click', () => {
  client.publish('manejobuzzer', 'buzzerhigh');
});

document.getElementById('buzzer-off').addEventListener('click', () => {
  client.publish('manejobuzzer', 'buzzerlow');
});
