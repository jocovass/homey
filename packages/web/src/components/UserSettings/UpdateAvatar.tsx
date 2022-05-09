import React from 'react';
import styled from '@emotion/styled';
import { RiPencilLine, RiCheckLine, RiCloseLine } from 'react-icons/ri';
import { AdvancedImage, responsive } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { focusOn } from '@cloudinary/url-gen/qualifiers/gravity';
import { FocusOn } from '@cloudinary/url-gen/qualifiers/focusOn';

import { useUser, uploadProfilePicture } from '../../context/userContext';
import { validateFileTypes } from '../../util/validations';
import { BtnLoader } from '../styled/BtnLoader';

const StyledUpdateAvatar = styled.div`
    margin-bottom: 3rem;

    .avatar {
        width: 20rem;
        height: 20rem;
        position: relative;

        &__image {
            width: 100%;
            height: 100%;
            background-color: ${props => props.theme.colors.greenGrey};
            border: 5px solid ${props => props.theme.colors.greenAccent};
            border-radius: 50%;
            overflow: hidden;
            position: relative;

            img {
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
            }
        }

        &__image-overlay {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            position: absolute;
            top: 0;
            left: 0;
            background-color: #00000053;
        }

        &__controls {
            display: flex;
            align-items: center;
            position: absolute;
            right: 12px;
            bottom: 12px;
        }

        &__select-file {
            cursor: pointer;
            display: flex;
            align-items: center;
            padding: 0.3em 0.5em;
            border-radius: 50px;
            background-color: #fff;
            border: 1px solid ${props => props.theme.colors.greenLighter};
            font-size: 1.2rem;
            color: ${props => props.theme.colors.black};
            transition-property: box-shadow;
            transition-duration: 300ms;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

            &:hover,
            &:focus,
            &:focus-visible {
                box-shadow: 0 0 0 0.15em black, 0 0 0 0.3em #fff;
                outline: 0;
            }

            svg,
            img {
                margin-right: 0.2rem;
            }

            input {
                display: none;
            }
        }

        &__save-btn,
        &__delete-btn {
            height: 2.85rem;
            width: 2.85rem;
            border-radius: 50%;
            margin-right: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.55rem;
            transition-property: box-shadow;
            transition-duration: 300ms;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            background-color: black;
            color: white;
        }

        &__save-btn {
            background-color: ${props => props.theme.colors.greenAccent};

            &:hover,
            &:focus,
            &:focus-visible {
                box-shadow: 0 0 0 0.1em black,
                    0 0 0 0.2em ${props => props.theme.colors.greenAccent};
                outline: 0;
            }
        }

        &__delete-btn {
            background-color: ${props => props.theme.colors.orangeRed};

            &:hover,
            &:focus,
            &:focus-visible {
                box-shadow: 0 0 0 0.1em black,
                    0 0 0 0.2em ${props => props.theme.colors.orangeRed};
                outline: 0;
            }
        }
    }

    .error-message {
        color: ${props => props.theme.colors.orangeRed};
        font-size: 1.4rem;
        margin-top: 1rem;
    }
`;

export const UpdateAvatar: React.FC = () => {
    const {
        state: { user, status },
        dispatch,
    } = useUser();
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [selectedFileURL, setSelectedFileURL] = React.useState<string | null>(
        null,
    );
    const [error, setError] = React.useState<string | null>(null);

    const isLoading = status === 'pending';

    // cloudinary stuff
    const cld = new Cloudinary({
        cloud: {
            cloudName: 'jozsefvass',
        },
    });
    const myImage = cld.image(user?.avatar);
    myImage.resize(
        fill().width(400).height(400).gravity(focusOn(FocusOn.face())),
    );

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.currentTarget.files) return;

        if (validateFileTypes(e.currentTarget.files)) {
            setSelectedFile(e.currentTarget.files[0]);
            setSelectedFileURL(URL.createObjectURL(e.currentTarget.files[0]));
            setError(null);
        } else {
            setError('We only support PNG, JPEG, or JPG pictures.');
        }
    };

    const handleDiscardImage = () => {
        setSelectedFile(null);
        setSelectedFileURL(null);
        setError(null);
    };

    const handleFileUpload = () => {
        if (!selectedFile) return;
        uploadProfilePicture({ file: selectedFile, dispatch }).then(() => {
            setSelectedFile(null);
            setError(null);
        });
    };

    return (
        <StyledUpdateAvatar>
            <div className="avatar">
                <div className="avatar__image">
                    {!selectedFile && (
                        <AdvancedImage
                            alt="Profile avatar"
                            cldImg={myImage}
                            plugins={[responsive()]}
                            onLoad={() => setSelectedFileURL(null)}
                        />
                    )}

                    {selectedFileURL && (
                        <img src={selectedFileURL} alt="Profile avatar" />
                    )}

                    {selectedFile && selectedFileURL && (
                        <div className="avatar__image-overlay">
                            {isLoading && (
                                <BtnLoader
                                    loaderColour="greenLight"
                                    className="medium"
                                />
                            )}
                        </div>
                    )}
                </div>

                <div className="avatar__controls">
                    {selectedFile && selectedFileURL ? (
                        <React.Fragment>
                            <button
                                aria-label="Upload image"
                                className="avatar__save-btn"
                                onClick={handleFileUpload}
                            >
                                <RiCheckLine />
                            </button>

                            <button
                                aria-label="Discard image"
                                className="avatar__delete-btn"
                                onClick={handleDiscardImage}
                            >
                                <RiCloseLine />
                            </button>
                        </React.Fragment>
                    ) : (
                        <label htmlFor="avatar" className="avatar__select-file">
                            <span>
                                <RiPencilLine />
                                Edit
                            </span>
                            <input
                                onChange={handleFileSelect}
                                type="file"
                                id="avatar"
                                name="avatar"
                            />
                        </label>
                    )}
                </div>
            </div>

            {error && <p className="error-message">{error}</p>}
        </StyledUpdateAvatar>
    );
};
