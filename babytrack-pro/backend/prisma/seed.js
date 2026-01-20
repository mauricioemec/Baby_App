const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes (cuidado em produção!)
  await prisma.medicationLog.deleteMany();
  await prisma.symptom.deleteMany();
  await prisma.medication.deleteMany();
  await prisma.growth.deleteMany();
  await prisma.diaper.deleteMany();
  await prisma.feeding.deleteMany();
  await prisma.baby.deleteMany();
  await prisma.fcmToken.deleteMany();
  await prisma.otpCode.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Dados antigos limpos');

  // Criar usuário de teste
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'teste@babytrack.com',
      password: hashedPassword,
    },
  });

  console.log('✅ Usuário criado:', user.email);

  // Criar bebê
  const birthDate = new Date();
  birthDate.setMonth(birthDate.getMonth() - 3); // 3 meses atrás

  const baby = await prisma.baby.create({
    data: {
      userId: user.id,
      name: 'Miguel',
      sex: 'male',
      birthDate: birthDate,
      birthWeight: 3200,
      birthHeight: 49.5,
      birthHeadCircumference: 34.5,
      useAdjustedAge: false,
      mlPerMinBreastfeeding: { '0-1': 5, '1-3': 6, '3-6': 7, '6+': 8 },
      mlPerKgTarget: 150,
      diaperTareWeight: 30,
      feedingReminderHours: 3,
      enableFeedingReminder: true,
      enableLowIntakeAlert: true,
      enableMedicationReminder: true,
      omsPercentile: 'P50',
    },
  });

  console.log('✅ Bebê criado:', baby.name);

  // Criar registros de crescimento (últimos 3 meses)
  const growthRecords = [];
  const baseWeight = 3200;
  const baseHeight = 49.5;

  for (let i = 0; i <= 12; i++) {
    const date = new Date(birthDate);
    date.setDate(date.getDate() + (i * 7)); // A cada 7 dias

    const weight = baseWeight + (i * 200); // Ganho de ~200g/semana
    const height = baseHeight + (i * 0.7); // Crescimento de ~0.7cm/semana

    growthRecords.push({
      babyId: baby.id,
      weightGrams: weight,
      heightCm: height,
      headCircumferenceCm: 34.5 + (i * 0.3),
      weightPercentile: 'P50',
      heightPercentile: 'P50',
      headPercentile: 'P50',
      timestamp: date,
      notes: `Consulta semana ${i}`,
    });
  }

  await prisma.growth.createMany({ data: growthRecords });
  console.log(`✅ ${growthRecords.length} registros de crescimento criados`);

  // Criar mamadas (últimos 7 dias)
  const feedingRecords = [];
  const now = new Date();

  for (let day = 6; day >= 0; day--) {
    // 6-8 mamadas por dia
    const feedingsPerDay = 6 + Math.floor(Math.random() * 3);

    for (let i = 0; i < feedingsPerDay; i++) {
      const feedingDate = new Date(now);
      feedingDate.setDate(feedingDate.getDate() - day);
      feedingDate.setHours(Math.floor(i * (24 / feedingsPerDay)), Math.floor(Math.random() * 60));

      const type = Math.random() > 0.7 ? 'bottle' : 'breast';
      const side = type === 'breast' ? (Math.random() > 0.5 ? 'left' : 'right') : null;
      const duration = type === 'breast' ? (10 + Math.floor(Math.random() * 20)) : null;
      const volumeMl = type === 'bottle' ? (60 + Math.floor(Math.random() * 60)) : (duration * 6);

      feedingRecords.push({
        babyId: baby.id,
        type,
        side,
        duration,
        volumeMl,
        timestamp: feedingDate,
      });
    }
  }

  await prisma.feeding.createMany({ data: feedingRecords });
  console.log(`✅ ${feedingRecords.length} mamadas criadas`);

  // Criar trocas de fralda (últimos 7 dias)
  const diaperRecords = [];

  for (let day = 6; day >= 0; day--) {
    // 8-10 fraldas por dia
    const diapersPerDay = 8 + Math.floor(Math.random() * 3);

    for (let i = 0; i < diapersPerDay; i++) {
      const diaperDate = new Date(now);
      diaperDate.setDate(diaperDate.getDate() - day);
      diaperDate.setHours(Math.floor(i * (24 / diapersPerDay)), Math.floor(Math.random() * 60));

      const rand = Math.random();
      let type, weightGrams;

      if (rand > 0.7) {
        type = 'both';
        weightGrams = 80 + Math.floor(Math.random() * 60);
      } else if (rand > 0.3) {
        type = 'pee';
        weightGrams = 50 + Math.floor(Math.random() * 40);
      } else {
        type = 'poop';
        weightGrams = null;
      }

      diaperRecords.push({
        babyId: baby.id,
        type,
        weightGrams,
        timestamp: diaperDate,
      });
    }
  }

  await prisma.diaper.createMany({ data: diaperRecords });
  console.log(`✅ ${diaperRecords.length} fraldas criadas`);

  // Criar medicamentos
  const medication1 = await prisma.medication.create({
    data: {
      babyId: baby.id,
      name: 'Vitamina D',
      dosage: '5 gotas',
      frequency: '1x/dia',
      times: ['08:00'],
      startDate: new Date(now.getFullYear(), now.getMonth(), 1),
      isActive: true,
      notes: 'Tomar após mamada da manhã',
    },
  });

  const medication2 = await prisma.medication.create({
    data: {
      babyId: baby.id,
      name: 'Probiótico',
      dosage: '5ml',
      frequency: '1x/dia',
      times: ['20:00'],
      startDate: new Date(now.getFullYear(), now.getMonth(), 1),
      isActive: true,
      notes: 'Diluir em água',
    },
  });

  console.log('✅ 2 medicamentos criados');

  // Criar logs de medicamentos (últimos 7 dias)
  const medicationLogs = [];

  for (let day = 6; day >= 0; day--) {
    const logDate = new Date(now);
    logDate.setDate(logDate.getDate() - day);

    // Vitamina D - 08:00
    const vitaminTime = new Date(logDate);
    vitaminTime.setHours(8, 0, 0, 0);

    medicationLogs.push({
      medicationId: medication1.id,
      scheduledTime: vitaminTime,
      takenAt: day > 0 ? new Date(vitaminTime.getTime() + Math.random() * 30 * 60000) : null, // Dentro de 30min
      skipped: false,
    });

    // Probiótico - 20:00
    const probioticTime = new Date(logDate);
    probioticTime.setHours(20, 0, 0, 0);

    medicationLogs.push({
      medicationId: medication2.id,
      scheduledTime: probioticTime,
      takenAt: day > 0 ? new Date(probioticTime.getTime() + Math.random() * 30 * 60000) : null,
      skipped: false,
    });
  }

  await prisma.medicationLog.createMany({ data: medicationLogs });
  console.log(`✅ ${medicationLogs.length} logs de medicamentos criados`);

  // Criar alguns sintomas
  const symptomDate1 = new Date(now);
  symptomDate1.setDate(symptomDate1.getDate() - 3);

  await prisma.symptom.create({
    data: {
      babyId: baby.id,
      type: 'fever',
      severity: 'mild',
      description: 'Febre baixa após vacina',
      temperature: 37.8,
      timestamp: symptomDate1,
    },
  });

  const symptomDate2 = new Date(now);
  symptomDate2.setDate(symptomDate2.getDate() - 5);

  await prisma.symptom.create({
    data: {
      babyId: baby.id,
      type: 'colic',
      severity: 'moderate',
      description: 'Cólica após mamada da tarde',
      timestamp: symptomDate2,
    },
  });

  console.log('✅ 2 sintomas criados');

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('\n📝 Credenciais de teste:');
  console.log('   Email: teste@babytrack.com');
  console.log('   Senha: password123');
  console.log(`   Bebê: ${baby.name} (${Math.floor((now - birthDate) / (1000 * 60 * 60 * 24 * 30))} meses)`);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
