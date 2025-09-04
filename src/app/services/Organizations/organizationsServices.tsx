import { Folder } from "@mui/icons-material";
import { OrganizationObj } from "../../models/OrganizationObj";
import { Theme } from "@mui/material";
import { organizationType } from "../ConstantsTypes";

export function getOrganizationsByUser(theme: Theme): OrganizationObj[] {
    return [
        {
            organizationId: 1,
            name: 'Projeto Inovação',
            description: 'Descrição do Projeto Inovação',
            favorite: true,
            organizationType: organizationType.COLLABORATIVE,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.star }} />
        },
        {
            organizationId: 2,
            name: 'Dev Ops',
            description: 'Descrição do Dev Ops',
            favorite: true,
            organizationType: organizationType.INDIVIDUAL,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            organizationId: 3,
            name: 'Teste',
            description: 'Descrição do Teste',
            favorite: true,
            organizationType: organizationType.INDIVIDUAL,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            organizationId: 4,
            name: 'Objetivos',
            description: 'Descrição do Objetivos',
            favorite: true,
            organizationType: organizationType.COLLABORATIVE,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            organizationId: 5,
            name: 'Projeto Inovação',
            description: 'Descrição do Projeto Inovação',
            favorite: true,
            organizationType: organizationType.COLLABORATIVE,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.star }} />
        },
        {
            organizationId: 6,
            name: 'Dev Ops',
            description: 'Descrição do Dev Ops',
            favorite: false,
            organizationType: organizationType.INDIVIDUAL,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            organizationId: 7,
            name: 'Teste',
            description: 'Descrição do Teste',
            favorite: false,
            organizationType: organizationType.INDIVIDUAL,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            organizationId: 8,
            name: 'Objetivos',
            description: 'Descrição do Objetivos',
            favorite: false,
            organizationType: organizationType.COLLABORATIVE,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            organizationId: 9,
            name: 'Projeto Inovação',
            description: 'Descrição do Projeto Inovação',
            favorite: false,
            organizationType: organizationType.COLLABORATIVE,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.star }} />
        },
        {
            organizationId: 10,
            name: 'Dev Ops',
            description: 'Descrição do Dev Ops',
            favorite: false,
            organizationType: organizationType.INDIVIDUAL,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            organizationId: 11,
            name: 'Teste',
            description: 'Descrição do Teste',
            favorite: false,
            organizationType: organizationType.INDIVIDUAL,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            organizationId: 12,
            name: 'Objetivos',
            description: 'Descrição do Objetivos',
            favorite: false,
            organizationType: organizationType.COLLABORATIVE,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            organizationId: 13,
            name: 'Projeto Inovação',
            description: 'Descrição do Projeto Inovação',
            favorite: false,
            organizationType: organizationType.COLLABORATIVE,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.star }} />
        },
        {
            organizationId: 14,
            name: 'Dev Ops',
            description: 'Descrição do Dev Ops',
            favorite: true,
            organizationType: organizationType.INDIVIDUAL,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            organizationId: 15,
            name: 'Teste',
            description: 'Descrição do Teste',
            favorite: true,
            organizationType: organizationType.INDIVIDUAL,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            organizationId: 16,
            name: 'Objetivos',
            description: 'Descrição do Objetivos',
            favorite: true,
            organizationType: organizationType.COLLABORATIVE,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        }
    ];
}