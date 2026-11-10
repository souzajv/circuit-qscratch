const {test,expect}=require('@playwright/test');
const {initializeApp,deleteApp,getApp}=require('firebase-admin/app');
const {getFirestore}=require('firebase-admin/firestore');
process.env.GCLOUD_PROJECT='demo-circuit-qscratch';process.env.FIRESTORE_EMULATOR_HOST='127.0.0.1:8080';process.env.FIREBASE_AUTH_EMULATOR_HOST='127.0.0.1:9099';
initializeApp({projectId:'demo-circuit-qscratch'});
test.afterAll(async()=>{await deleteApp(getApp());});
// Limpa somente o projeto descartável do emulador antes da bateria.
test.beforeAll(async({request})=>{
 await request.delete('http://127.0.0.1:9099/emulator/v1/projects/demo-circuit-qscratch/accounts');
 await request.delete('http://127.0.0.1:8080/emulator/v1/projects/demo-circuit-qscratch/databases/(default)/documents');
});
test('professor cria acesso, aluno entra sem senha, progresso é consultado e revogação bloqueia',async({page,browser})=>{
 await page.goto('/#/entrar');await page.getByRole('button',{name:'Criar conta',exact:true}).click();
 await page.getByRole('button',{name:'Sou professor'}).click();await page.getByLabel('Nome ou apelido').fill('Professor E2E');
 await page.getByLabel('E-mail',{exact:true}).fill(`prof-${Date.now()}@example.test`);
 await page.getByLabel('Senha',{exact:true}).fill('Teste-Seguro-2026');await page.getByLabel('Confirmar senha').fill('Teste-Seguro-2026');
 await page.getByRole('button',{name:'Criar minha conta'}).click();await page.getByRole('button',{name:'Meus alunos',exact:true}).click();
 await page.getByLabel('Nome ou apelido').fill('Aluno por link');await page.getByLabel('Mostrar formulário antes').uncheck();await page.getByLabel('Mostrar formulário depois').uncheck();
 await page.getByRole('button',{name:'Criar acesso'}).click();const input=page.getByLabel('Link do aluno');await expect(input).toBeVisible();const link=await input.inputValue();
 const student=await browser.newContext();const pupil=await student.newPage();await pupil.goto(link);await pupil.getByRole('button',{name:'Entrar pelo meu link'}).click();
 await expect(pupil.getByRole('button',{name:'Meus alunos',exact:true})).toHaveCount(0);await pupil.getByRole('button',{name:'Vamos começar',exact:true}).click();
 await expect(pupil.getByRole('heading',{name:'Uma informação de cada vez'})).toBeVisible();await expect(pupil.getByRole('heading',{name:'Antes da sua descoberta'})).toHaveCount(0);
 await pupil.getByRole('button',{name:'Próximo',exact:true}).click();await expect(pupil.getByRole('heading',{name:'O que muda com um qubit?'})).toBeVisible();
 await expect(pupil.getByText('Progresso salvo na conta',{exact:true})).toHaveCount(0); // menu fica oculto na aula
 await expect.poll(async()=>{const id=link.split('/convite/')[1].split('/')[0];return (await getFirestore().collection('progress').doc(id).get()).data()?.state.attempt?.[0]?.page;}).toBe(1);
 for(let i=0;i<5;i++)await pupil.getByRole('button',{name:i===4?'Iniciar teste':'Próximo',exact:true}).click();
 await pupil.getByRole('radio',{name:'Um qubit',exact:true}).check({timeout:15000});await pupil.getByRole('button',{name:'Conferir resposta',exact:true}).click();
 await expect.poll(async()=>{const id=link.split('/convite/')[1].split('/')[0];return Object.values((await getFirestore().collection('progress').doc(id).get()).data()?.state.answerHistory||{}).some(a=>a.selected==='Um qubit'&&!a.correct);}).toBe(true);
 await page.getByRole('button',{name:'Ver progresso',exact:true}).click();await expect(page.getByRole('heading',{name:'Aluno por link'})).toBeVisible();
 await page.locator('summary').filter({hasText:'Conheça os qubits'}).click();await expect(page.getByText(/Resposta: Um qubit/)).toBeVisible();
 await page.getByRole('button',{name:'Revogar link',exact:true}).click();const second=await browser.newContext();const revoked=await second.newPage();await revoked.goto(link);await revoked.getByRole('button',{name:'Entrar pelo meu link'}).click();await expect(revoked.getByRole('alert')).toContainText('revogado');
 await page.getByRole('button',{name:'Excluir aluno',exact:true}).click();await page.getByRole('button',{name:'Confirmar exclusão',exact:true}).click();await expect(page.getByText('Nenhum aluno criado.',{exact:true})).toBeVisible();
 await student.close();await second.close();
});

test('papéis não podem ser elevados pelo cliente e admin consulta professores e alunos de outras contas',async({page,request})=>{
 const stamp=Date.now();
 const signup=async(label,role)=>{const email=`${label}-${stamp}@example.test`;const result=await request.post('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake',{data:{email,password:'Teste-Seguro-2026',returnSecureToken:true}});const user=await result.json();const response=await request.post('/api/classroom',{headers:{Authorization:`Bearer ${user.idToken}`},data:{action:'profile',role}});return {...user,email,profile:await response.json()};};
 const teacherA=await signup('teacher-a','teacher'),teacherB=await signup('teacher-b','teacher'),admin=await signup('admin','admin');
 expect(admin.profile.role).toBe('student');
 const call=(user,action,data={})=>request.post('/api/classroom',{headers:{Authorization:`Bearer ${user.idToken}`},data:{...data,action}});
 const created=await (await call(teacherA,'create',{name:'Aluno protegido'})).json();
 expect((await call(teacherB,'detail',{id:created.id})).status()).toBe(403);
 expect((await call(teacherB,'accounts')).status()).toBe(403);
 await getFirestore().collection('profiles').doc(admin.localId).set({role:'admin'});
 expect((await call(admin,'detail',{id:created.id})).status()).toBe(200);
 await page.goto('/#/entrar');await page.getByLabel('E-mail',{exact:true}).fill(admin.email);await page.getByLabel('Senha',{exact:true}).fill('Teste-Seguro-2026');await page.getByRole('button',{name:'Entrar na trilha'}).click();
 await page.getByRole('button',{name:'Administração',exact:true}).click();await expect(page.getByRole('heading',{name:'Contas da plataforma'})).toBeVisible();await expect(page.getByText('Aluno protegido',{exact:true})).toBeVisible();await expect(page.getByText(teacherA.email,{exact:false})).toBeVisible();
});

test('formulário habilitado é obrigatório, fica salvo na conta do link e chega ao professor',async({page,request,browser})=>{
 const email=`survey-teacher-${Date.now()}@example.test`;
 const created=await request.post('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake',{data:{email,password:'Teste-Seguro-2026',returnSecureToken:true}});
 const teacher=await created.json(),headers={Authorization:`Bearer ${teacher.idToken}`};
 await request.post('/api/classroom',{headers,data:{action:'profile',role:'teacher'}});
 const response=await request.post('/api/classroom',{headers,data:{action:'create',name:'Aluno com pesquisa',surveys:{before:true,after:false}}});const invitation=await response.json();
 const context=await browser.newContext();const pupil=await context.newPage();await pupil.goto(`/#/convite/${invitation.id}/${invitation.secret}`);await pupil.getByRole('button',{name:'Entrar pelo meu link'}).click();await pupil.getByRole('button',{name:'Vamos começar',exact:true}).click();
 await expect(pupil.getByRole('heading',{name:'Antes da sua descoberta'})).toBeVisible();await expect(pupil.getByRole('button',{name:/Pular questionário/})).toHaveCount(0);await pupil.getByRole('button',{name:/Quero responder/}).click();
 const answers=['Ensino Médio','Não','Sim','Não','Bastante','Pouco','Não sei ainda','Não sei ainda'];
 for(let i=0;i<answers.length;i++){await pupil.getByRole('button',{name:answers[i],exact:true}).click();await pupil.getByRole('button',{name:i===answers.length-1?'Enviar respostas':'Próxima',exact:true}).click();}
 await expect(pupil.getByRole('heading',{name:'Uma informação de cada vez'})).toBeVisible();
 await expect.poll(async()=>(await getFirestore().collection('progress').doc(invitation.id).get()).data()?.state.surveys.before.answers.education).toBe('Ensino Médio');
 await page.goto('/#/entrar');await page.getByLabel('E-mail',{exact:true}).fill(email);await page.getByLabel('Senha',{exact:true}).fill('Teste-Seguro-2026');await page.getByRole('button',{name:'Entrar na trilha'}).click();await page.getByRole('button',{name:'Meus alunos',exact:true}).click();await page.getByRole('button',{name:'Ver progresso',exact:true}).click();
 await page.locator('summary').filter({hasText:'Antes da trilha'}).click();await expect(page.getByText('Ensino Médio',{exact:true})).toBeVisible();
 await page.screenshot({path:'test-results/painel-professor-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);await page.screenshot({path:'test-results/painel-professor-mobile.png',fullPage:true});await context.close();
});
