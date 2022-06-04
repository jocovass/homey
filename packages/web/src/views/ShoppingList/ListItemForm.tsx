import React from 'react';
import styled from '@emotion/styled';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const StyledListItemForm = styled.form`
    display: flex;
    flex-direction: column;
    flex: 1;

    input {
        margin-bottom: 1rem;
        padding: 1rem;
        border: 1px solid transparent;
        border-radius: 8px;
        outline: 0;
        box-shadow: none;

        &.error {
            border: 1px solid ${props => props.theme.colors.orangeRed};
        }
    }

    .form-btns {
        display: flex;
        align-items: center;

        .save,
        .cancel {
            cursor: pointer;
            display: flex;
            align-items: center;
            padding: 0.3em 0.5em;
            margin-top: 0.5rem;
            border-radius: 50px;
            font-size: 1.4rem;
            color: #fff;
            transition-property: box-shadow;
            transition-duration: 300ms;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

            svg,
            img {
                margin-right: 0.2rem;
            }

            input {
                display: none;
            }
        }

        .save {
            background-color: ${props => props.theme.colors.greenAccent};
            margin-right: 1rem;

            &:hover,
            &:focus,
            &:focus-visible {
                box-shadow: 0 0 0 0.075em
                        ${props => props.theme.colors.greyLight},
                    0 0 0 0.15em ${props => props.theme.colors.greenAccent};
                outline: 0;
            }
        }

        .cancel {
            background-color: ${props => props.theme.colors.orangeRed};

            &:hover,
            &:focus,
            &:focus-visible {
                box-shadow: 0 0 0 0.075em
                        ${props => props.theme.colors.greyLight},
                    0 0 0 0.15em ${props => props.theme.colors.orangeRed};
                outline: 0;
            }
        }
    }
`;

type ShoppingListItem = {
    label: string;
    amount: number;
    unit: string;
    status?: 'pending' | 'done';
    id: number;
};

type ListItemProps = {
    item: ShoppingListItem;
    updateItem: (item: ShoppingListItem) => void;
    setEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

type ListItemFormFields = {
    label: string;
    amount: number;
    unit: string;
};

const schema = yup.object({
    label: yup.string().required(),
    amount: yup.number().required(),
    unit: yup.string().required(),
});

export const ListItemForm: React.FC<ListItemProps> = ({
    item,
    updateItem,
    setEditing,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields },
    } = useForm<ListItemFormFields>({
        defaultValues: {
            label: item.label,
            amount: item.amount,
            unit: item.unit,
        },
        resolver: yupResolver(schema),
        mode: 'all',
        criteriaMode: 'all',
    });
    const submitHandler = (data: ListItemFormFields) => {
        updateItem({
            ...item,
            label: data.label,
            amount: data.amount,
            unit: data.unit,
        });

        setEditing(prev => !prev);
    };

    return (
        <StyledListItemForm onSubmit={handleSubmit(submitHandler)}>
            <input
                className={touchedFields.label && errors.label ? 'error' : ''}
                type="text"
                id="label"
                defaultValue={item.label}
                placeholder="ex. Egss"
                {...register('label')}
            />
            <input
                className={touchedFields.amount && errors.amount ? 'error' : ''}
                type="number"
                id="amount"
                defaultValue={item.amount}
                placeholder="ex. 1"
                {...register('amount')}
            />
            <input
                className={touchedFields.unit && errors.unit ? 'error' : ''}
                type="text"
                id="unit"
                defaultValue={item.unit}
                placeholder="ex. pack"
                {...register('unit')}
            />

            <div className="form-btns">
                <button className="save">Save</button>
                <button
                    className="cancel"
                    type="button"
                    onClick={() => setEditing(prev => !prev)}
                >
                    Cancel
                </button>
            </div>
        </StyledListItemForm>
    );
};
