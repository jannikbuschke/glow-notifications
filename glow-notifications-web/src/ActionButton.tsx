import * as React from "react"
import { Field, FieldProps } from "formik"
import { Button, message } from "antd"
import { ButtonProps } from "antd/lib/button"

export function ActionButton({ onClick, ...props }: ButtonProps) {
  const [loading, setLoading] = React.useState(false)
  return (
    <Field>
      {({ form }: FieldProps) => (
        <Button
          loading={loading}
          disabled={form.dirty}
          onClick={
            onClick
              ? async (e) => {
                  setLoading(true)
                  try {
                    await onClick(e)
                  } catch (E) {
                    message.error(E.toString())
                  }
                  setLoading(false)
                }
              : undefined
          }
          {...props}
        />
      )}
    </Field>
  )
}
