export const formatServerError = (errors: { [key: string]: string }[]) =>
    errors.reduce(
        (acc: { [key: string]: string }, error: { [key: string]: string }) => {
            let key = Object.keys(error)[0];

            if (!acc[key]) {
                acc[key] = error[key];
            }

            return acc;
        },
        {},
    );
