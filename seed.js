import Database from 'better-sqlite3';import fs from 'fs';
const D=process.env.DATA_DIR||'./data';fs.mkdirSync(D+'/uploads',{recursive:true});
const db=new Database(D+'/ban.db');
try{db.prepare('select 1 from products').get()}catch{console.error("Démarrez d'abord l'application (docker compose up -d), puis relancez.");process.exit(1)}
if(db.prepare('select count(*) n from products').get().n&&!process.argv.includes('--force')){console.log('Le catalogue contient déjà des articles. Ajoutez --force pour ajouter quand même les exemples.');process.exit(0)}
// [nom, matière, description, catégorie, prix FCFA, stock (null = non suivi), disponible, image]
const A=[
['Pochette pagne wax','Pagne wax, doublure coton, fermeture éclair','Pochette aux motifs losanges, pensée pour le jour comme pour le soir. Finitions faites main.','Sacs',15000,4,1,'pochette'],
['Sac cabas raphia','Raphia tressé à la main, anses renforcées','Un cabas ample et léger, à porter à l’épaule. Chaque pièce est légèrement unique.','Sacs',22500,2,1,'cabas'],
['Collier cauris','Perles de bois, laiton, cauri','Collier ras du cou, un cauri en pièce centrale : signe de parure et de valeur.','Bijoux',9000,0,0,'collier'],
['Boucles d’oreilles perlées','Perles de bois et laiton','Boucles pendantes, légères, qui s’accordent à une tenue sobre.','Bijoux',6500,10,1,'boucles'],
['Ceinture perlée','Cuir noir, rangs de perles, boucle en laiton','Ceinture large qui structure une robe ou une veste.','Accessoires',12500,3,1,'ceinture'],
['Bracelet laiton','Laiton massif, finition mate','Jonc épuré, à porter seul ou en accumulation.','Bijoux',8000,null,1,'bracelet'],
['Article test - paiement démo','—','Article à 25 FCFA pour tester le paiement CamPay en mode démo. À archiver avant la mise en ligne.','Accessoires',25,null,1,'bracelet']];
const ins=db.prepare('insert into products(name,material,description,category,price,stock,available,image) values(?,?,?,?,?,?,?,?)');
for(const[n,m,d,c,p,s,a,img]of A){fs.copyFileSync(`seed/${img}.png`,`${D}/uploads/seed-${img}.png`);ins.run(n,m,d,c,p,s,a,`/uploads/seed-${img}.png`)}
console.log(A.length+' articles d’exemple ajoutés.');
