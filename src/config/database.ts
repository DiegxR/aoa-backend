import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ CRITICAL: MONGODB_URI no está definida en las variables de entorno');
    console.log('Variables de entorno actuales:', Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('PASSWORD') && !k.includes('KEY')));
    throw new Error('MONGODB_URI no está definida en las variables de entorno');
  }

  const maskedUri = uri.replace(/\/\/.*@/, '//****:****@');
  console.log(`📡 Intentando conectar a MongoDB con URI: ${maskedUri}`);
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB conectado exitosamente`);
    console.log(`🏠 Host: ${conn.connection.host}`);
    console.log(`📂 Base de Datos: ${conn.connection.name}`);
    console.log(`📊 Estado de la conexión: ${mongoose.connection.readyState}`);


    mongoose.connection.on('error', (err) => {
      console.error('❌ Error de MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB desconectado');
    });

  } catch (error) {
    console.error('❌ Error al conectar MongoDB:', error);
    process.exit(1);  
  }
};