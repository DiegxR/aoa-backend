import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ CRITICAL: MONGODB_URI no está definida en las variables de entorno');
    throw new Error('MONGODB_URI no está definida en las variables de entorno');
  }

  console.log('📡 Intentando conectar a MongoDB...');
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);


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