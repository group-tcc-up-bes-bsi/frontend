import React from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import { Backdrop, Box } from '@mui/material';
import CustomTypography from '../customTypography';
import { useAuth } from '../useAuth';
import { useTermFormStore } from '@/app/state/termFormState';

const TermsViewer: React.FC = () => {
    useAuth();
    const { theme } = useTheme();
    const termText = useTermFormStore((state) => state.termText);
    const alterTermForm = useTermFormStore((state) => state.alter);
    const alterText = useTermFormStore((state) => state.alterText);

    alterText(`
Estudo do texto
O interesse pelo texto como objeto de estudo gerou vários trabalhos importantes de teóricos da Linguística Textual, 
que percorreram fases diversas cujas características principais eram transpor os limites da frase descontextualizada da gramática tradicional 
e ainda incluir os relevantes papéis do autor e do leitor na construção de textos.

Um texto pode ser escrito ou oral e, em sentido lato, pode ser também não verbal.
Texto crítico é uma produção textual que parte de um processo reflexivo e analítico, gerando um conteúdo com crítica construtiva e bem fundamentada.

Em artes gráficas, o texto é a parte verbal, linguística, por oposição às ilustrações.

Estrutura do texto
Todo texto tem que ter alguns aspectos formais, ou seja, tem que ter estrutura, elementos que estabelecem relação entre si. 
Dentro dos aspectos formais temos a coesão e a coerência, que dão sentido e forma ao texto. 
"A coesão textual é a relação, a ligação, a conexão entre as palavras, expressões ou frases do texto".
A coerência está relacionada com a compreensão, a interpretação do que se diz ou escreve. Um texto precisa ter sentido, isto é, precisa ter coerência.
Estudo do texto
O interesse pelo texto como objeto de estudo gerou vários trabalhos importantes de teóricos da Linguística Textual, 
que percorreram fases diversas cujas características principais eram transpor os limites da frase descontextualizada da gramática tradicional 
e ainda incluir os relevantes papéis do autor e do leitor na construção de textos.

Um texto pode ser escrito ou oral e, em sentido lato, pode ser também não verbal.
Texto crítico é uma produção textual que parte de um processo reflexivo e analítico, gerando um conteúdo com crítica construtiva e bem fundamentada.

Em artes gráficas, o texto é a parte verbal, linguística, por oposição às ilustrações.

Estrutura do texto
Todo texto tem que ter alguns aspectos formais, ou seja, tem que ter estrutura, elementos que estabelecem relação entre si. 
Dentro dos aspectos formais temos a coesão e a coerência, que dão sentido e forma ao texto. 
"A coesão textual é a relação, a ligação, a conexão entre as palavras, expressões ou frases do texto".
A coerência está relacionada com a compreensão, a interpretação do que se diz ou escreve. Um texto precisa ter sentido, isto é, precisa ter coerência.
Estudo do texto
O interesse pelo texto como objeto de estudo gerou vários trabalhos importantes de teóricos da Linguística Textual, 
que percorreram fases diversas cujas características principais eram transpor os limites da frase descontextualizada da gramática tradicional 
e ainda incluir os relevantes papéis do autor e do leitor na construção de textos.

Um texto pode ser escrito ou oral e, em sentido lato, pode ser também não verbal.
Texto crítico é uma produção textual que parte de um processo reflexivo e analítico, gerando um conteúdo com crítica construtiva e bem fundamentada.

Em artes gráficas, o texto é a parte verbal, linguística, por oposição às ilustrações.

Estrutura do texto
Todo texto tem que ter alguns aspectos formais, ou seja, tem que ter estrutura, elementos que estabelecem relação entre si. 
Dentro dos aspectos formais temos a coesão e a coerência, que dão sentido e forma ao texto. 
"A coesão textual é a relação, a ligação, a conexão entre as palavras, expressões ou frases do texto".
A coerência está relacionada com a compreensão, a interpretação do que se diz ou escreve. Um texto precisa ter sentido, isto é, precisa ter coerência.
Estudo do texto
O interesse pelo texto como objeto de estudo gerou vários trabalhos importantes de teóricos da Linguística Textual, 
que percorreram fases diversas cujas características principais eram transpor os limites da frase descontextualizada da gramática tradicional 
e ainda incluir os relevantes papéis do autor e do leitor na construção de textos.

Um texto pode ser escrito ou oral e, em sentido lato, pode ser também não verbal.
Texto crítico é uma produção textual que parte de um processo reflexivo e analítico, gerando um conteúdo com crítica construtiva e bem fundamentada.

Em artes gráficas, o texto é a parte verbal, linguística, por oposição às ilustrações.

Estrutura do texto
Todo texto tem que ter alguns aspectos formais, ou seja, tem que ter estrutura, elementos que estabelecem relação entre si. 
Dentro dos aspectos formais temos a coesão e a coerência, que dão sentido e forma ao texto. 
"A coesão textual é a relação, a ligação, a conexão entre as palavras, expressões ou frases do texto".
A coerência está relacionada com a compreensão, a interpretação do que se diz ou escreve. Um texto precisa ter sentido, isto é, precisa ter coerência.
`);


    return (
        <Box>
            <Backdrop
                open={true}
                onClick={() => alterTermForm(false)}
                sx={{
                    zIndex: 3,
                    color: '#fff',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}
            />
            <Box
                sx={{
                    zIndex: 200,
                    position: 'absolute',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: theme.palette.background.default,
                    width: '1200px',
                    height: '700px',
                    borderRadius: '4px',
                    boxShadow: theme.shadows[3],
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    p: 3,
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                        width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: theme.palette.background.default,
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: '3px',
                    }
                }}
            >
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                    <CustomTypography
                        text={termText}
                        component="h2"
                        variant="h6"
                        sx={{
                            color: theme.palette.text.primary,
                            mb: 1,
                            padding: 1,
                            fontWeight: 'bold',
                            width: '100%',
                            borderBottom: `1px solid ${theme.palette.text.primary}`,
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default TermsViewer;