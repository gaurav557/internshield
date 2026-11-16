import { PrismaClient, Role, VerificationStatus, RiskLevel } from '@prisma/client';
import bcrypt from 'bcryptjs';
const db = new PrismaClient();
async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@internshield.local';
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  await db.user.upsert({ where: { email }, update: {}, create: { name: 'Platform Admin', email, passwordHash: await bcrypt.hash(password, 12), role: Role.ADMIN } });
  const samples = [
    { name: 'Northstar Technologies', website: 'https://northstar.example', industry: 'Software', location: 'Bengaluru, India', status: VerificationStatus.VERIFIED, riskScore: 8, riskLevel: RiskLevel.LOW, description: 'Sample verified company profile.' },
    { name: 'QuickEarn Career Hub', website: 'http://quickearn-careers.example', industry: 'Recruitment', location: 'Remote', status: VerificationStatus.FLAGGED, riskScore: 86, riskLevel: RiskLevel.HIGH, description: 'Sample record containing suspicious payment and urgency signals.' },
    { name: 'BluePeak Analytics', website: 'https://bluepeak.example', industry: 'Data Analytics', location: 'Pune, India', status: VerificationStatus.PENDING, riskScore: 38, riskLevel: RiskLevel.MEDIUM, description: 'Sample company awaiting manual review.' }
  ];
  for (const item of samples) await db.company.upsert({ where: { id: item.name.replaceAll(' ', '-').toLowerCase() }, update: {}, create: { id: item.name.replaceAll(' ', '-').toLowerCase(), ...item } }).catch(async () => { if (!(await db.company.findFirst({ where: { name: item.name } }))) await db.company.create({ data: item }); });
}
main().finally(() => db.$disconnect());
