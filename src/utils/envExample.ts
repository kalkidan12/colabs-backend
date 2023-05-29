import fs from 'fs';

export default function envExample() {
  let envExample = fs.readFileSync('.env', 'utf8');
  envExample = envExample.replace(/=.*/g, '=env_value');
  fs.writeFileSync('.env.example', envExample);
}
