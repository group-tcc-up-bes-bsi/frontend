import { Folder } from "@mui/icons-material";
import { OrganizationObj } from "../../models/OrganizationObj";
import { Theme } from "@mui/material";
import { organizationType } from "../ConstantsTypes";

export function getOrganizationsByUser(theme: Theme): OrganizationObj[] {
    return [
        {
            organizationId: 1,
            organizationName: 'Projeto Inovação',
            organizationDescription: 'Descrição do Projeto Inovação',
            favorite: true,
            organizationType: organizationType.COLLABORATIVE,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.star }} />
        },
        {
            organizationId: 2,
            organizationName: 'Dev Ops',
            organizationDescription: 'Descrição do Dev Ops',
            favorite: true,
            organizationType: organizationType.INDIVIDUAL,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            organizationId: 3,
            organizationName: 'Teste',
            organizationDescription: 'Descrição do Teste',
            favorite: true,
            organizationType: organizationType.INDIVIDUAL,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            organizationId: 4,
            organizationName: 'Objetivos',
            organizationDescription: 'Descrição do Objetivos',
            favorite: true,
            organizationType: organizationType.COLLABORATIVE,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            organizationId: 5,
            organizationName: 'Projeto Inovação',
            organizationDescription: 'Descrição do Projeto Inovação',
            favorite: true,
            organizationType: organizationType.COLLABORATIVE,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.star }} />
        },
        {
            organizationId: 6,
            organizationName: 'Dev Ops',
            organizationDescription: 'Descrição do Dev Ops',
            favorite: false,
            organizationType: organizationType.INDIVIDUAL,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            organizationId: 7,
            organizationName: 'Teste',
            organizationDescription: 'Descrição do Teste',
            favorite: false,
            organizationType: organizationType.INDIVIDUAL,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            organizationId: 8,
            organizationName: 'Objetivos',
            organizationDescription: 'Descrição do Objetivos',
            favorite: false,
            organizationType: organizationType.COLLABORATIVE,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            organizationId: 9,
            organizationName: 'Projeto Inovação',
            organizationDescription: 'Descrição do Projeto Inovação',
            favorite: false,
            organizationType: organizationType.COLLABORATIVE,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.star }} />
        },
        {
            organizationId: 10,
            organizationName: 'Dev Ops',
            organizationDescription: 'Descrição do Dev Ops',
            favorite: false,
            organizationType: organizationType.INDIVIDUAL,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            organizationId: 11,
            organizationName: 'Teste',
            organizationDescription: 'Descrição do Teste',
            favorite: false,
            organizationType: organizationType.INDIVIDUAL,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            organizationId: 12,
            organizationName: 'Objetivos',
            organizationDescription: 'Descrição do Objetivos',
            favorite: false,
            organizationType: organizationType.COLLABORATIVE,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            organizationId: 13,
            organizationName: 'Projeto Inovação',
            organizationDescription: 'Descrição do Projeto Inovação',
            favorite: false,
            organizationType: organizationType.COLLABORATIVE,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.star }} />
        },
        {
            organizationId: 14,
            organizationName: 'Dev Ops',
            organizationDescription: 'Descrição do Dev Ops',
            favorite: true,
            organizationType: organizationType.INDIVIDUAL,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            organizationId: 15,
            organizationName: 'Teste',
            organizationDescription: 'Descrição do Teste',
            favorite: true,
            organizationType: organizationType.INDIVIDUAL,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            organizationId: 16,
            organizationName: 'Objetivos',
            organizationDescription: 'Descrição do Objetivos',
            favorite: true,
            organizationType: organizationType.COLLABORATIVE,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        }
    ];
}