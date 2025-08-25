import { Folder } from "@mui/icons-material";
import { OrganizationFavorite, OrganizationObjWithIcon } from "../../models/OrganizationObj";
import { Theme } from "@mui/material";
import { organizationsType } from "../ConstantsTypes";

export function getOrganizationsByUser(theme: Theme): OrganizationObjWithIcon[] {
    return [
        {
            id: 1,
            title: 'Projeto Inovação',
            description: 'Descrição do Projeto Inovação',
            createdBy: 'Lucas',
            type: organizationsType.COLLABORATIVE,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.star }} />
        },
        {
            id: 2,
            title: 'Dev Ops',
            description: 'Descrição do Dev Ops',
            createdBy: 'Gregory',
            type: organizationsType.INDIVIDUAL,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            id: 3,
            title: 'Teste',
            description: 'Descrição do Teste',
            createdBy: 'Gregory',
            type: organizationsType.INDIVIDUAL,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            id: 4,
            title: 'Objetivos',
            description: 'Descrição do Objetivos',
            createdBy: 'Gregory',
            type: organizationsType.COLLABORATIVE,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            id: 5,
            title: 'Projeto Inovação',
            description: 'Descrição do Projeto Inovação',
            createdBy: 'Lucas',
            type: organizationsType.COLLABORATIVE,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.star }} />
        },
        {
            id: 6,
            title: 'Dev Ops',
            description: 'Descrição do Dev Ops',
            createdBy: 'Gregory',
            type: organizationsType.INDIVIDUAL,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            id: 7,
            title: 'Teste',
            description: 'Descrição do Teste',
            createdBy: 'Gregory',
            type: organizationsType.INDIVIDUAL,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            id: 8,
            title: 'Objetivos',
            description: 'Descrição do Objetivos',
            createdBy: 'Gregory',
            type: organizationsType.COLLABORATIVE,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            id: 9,
            title: 'Projeto Inovação',
            description: 'Descrição do Projeto Inovação',
            createdBy: 'Lucas',
            type: organizationsType.COLLABORATIVE,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.star }} />
        },
        {
            id: 10,
            title: 'Dev Ops',
            description: 'Descrição do Dev Ops',
            createdBy: 'Gregory',
            type: organizationsType.INDIVIDUAL,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            id: 11,
            title: 'Teste',
            description: 'Descrição do Teste',
            createdBy: 'Gregory',
            type: organizationsType.INDIVIDUAL,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            id: 12,
            title: 'Objetivos',
            description: 'Descrição do Objetivos',
            createdBy: 'Gregory',
            type: organizationsType.COLLABORATIVE,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            id: 13,
            title: 'Projeto Inovação',
            description: 'Descrição do Projeto Inovação',
            createdBy: 'Lucas',
            type: organizationsType.COLLABORATIVE,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.star }} />
        },
        {
            id: 14,
            title: 'Dev Ops',
            description: 'Descrição do Dev Ops',
            createdBy: 'Gregory',
            type: organizationsType.INDIVIDUAL,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            id: 15,
            title: 'Teste',
            description: 'Descrição do Teste',
            createdBy: 'Gregory',
            type: organizationsType.INDIVIDUAL,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            id: 16,
            title: 'Objetivos',
            description: 'Descrição do Objetivos',
            createdBy: 'Gregory',
            type: organizationsType.COLLABORATIVE,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        }
    ];
}

export function getOrganizationsFavorites(): OrganizationFavorite[] {
    return [
        { id: 1, favorite: true, title: 'TCC', totDocuments: 10 },
        { id: 2, favorite: false, title: 'Compras', totDocuments: 2 },
    ];
}