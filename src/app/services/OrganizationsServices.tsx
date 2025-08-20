import { Folder } from "@mui/icons-material";
import { OrganizationObjWithIcon } from "../models/OrganizationObj";
import { Theme } from "@mui/material";
import { organizationsType } from "./ConstantsTypes";

export function getOrganizationsByUser(theme: Theme): OrganizationObjWithIcon[] {
    return [
        {
            id: '1',
            title: 'Projeto Inovação',
            description: 'Descrição do Projeto Inovação',
            createdBy: 'Lucas',
            type: organizationsType.COLLABORATIVE,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.star }} />
        },
        {
            id: '2',
            title: 'Dev Ops',
            description: 'Descrição do Dev Ops',
            createdBy: 'Gregory',
            type: organizationsType.INDIVIDUAL,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            id: '3',
            title: 'Teste',
            description: 'Descrição do Teste',
            createdBy: 'Gregory',
            type: organizationsType.INDIVIDUAL,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        },
        {
            id: '4',
            title: 'Objetivos',
            description: 'Descrição do Objetivos',
            createdBy: 'Gregory',
            type: organizationsType.COLLABORATIVE,
            borderColor: theme.palette.text.primary,
            icon: <Folder sx={{ color: theme.palette.button.primary }} />
        }
    ];
}