# Preparação do banco

**Escopo atualizado:** a plataforma terá conta individual e dois níveis de escolaridade; o esquema de múltiplos perfis e responsáveis deve ser redesenhado. Esta migração histórica não representa o novo escopo e não deve ser aplicada como solução pronta.

**Atualização de 03/11/2026:** por decisão do usuário, manter a migração em rascunho e retomar o banco após definição dos contratos do front. Os novos requisitos incluem idade, nome, senha para troca de perfil e acesso individual “+14” sujeito a esclarecimento e validação institucional; a migração atual não os implementa.

`migrations/202610310001_base.sql` é uma migração inicial preparada localmente. Ela cria tabelas, separa gabaritos em esquema privado e habilita RLS sem políticas de acesso. Portanto o aplicativo ainda não consegue usar o banco por meio dessas tabelas. Não existe aqui implementação de cadastro de perfis, autorização infantil, pontuação, publicação de conteúdos ou exclusão completa.

A migração foi executada com sucesso em PostgreSQL 16 isolado no Docker, usando papéis `anon`, `authenticated` e `auth.users` simulados. Foi verificado que as sete tabelas públicas têm RLS habilitada e que `authenticated` não possui permissão direta de SELECT. Isso comprova sintaxe e estado fechado básico nessa simulação, não autenticação Supabase, políticas, isolamento infantil ou acesso completo. **Não foi aplicada remotamente.** Próximos passos: testar relacionamentos e restrições, criar funções autorizadas e transacionais, implementar autorização infantil sem compartilhar privilégios, definir retenção, testar contas e perfis, recuperação e concorrência. Os textos científicos e valores de pontuação aguardam revisão.

Políticas de acesso, funções privilegiadas e dados reais exigem atenção especial: executar o arquivo não significa conformidade, segurança verificada ou conclusão dos requisitos. A base remota só deve ser marcada como pronta após execução e testes reais. A documentação Supabase recomenda [testar RLS](https://supabase.com/docs/guides/database/testing) e [restringir funções privilegiadas](https://supabase.com/docs/guides/database/functions).
