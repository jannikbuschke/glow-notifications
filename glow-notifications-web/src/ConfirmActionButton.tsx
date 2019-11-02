import * as React from "react"
import { Field, FieldProps } from "formik"
import { Popconfirm, message } from "antd"
import { PopconfirmProps } from "antd/lib/popconfirm"

export function ConfirmAction({
  onConfirm,
  children,
  ...props
}: PopconfirmProps & { children: React.ReactElement }) {
  const [loading, setLoading] = React.useState(false)

  return (
    <Field>
      {({ form }: FieldProps) => (
        <Popconfirm
          disabled={form.dirty}
          onConfirm={
            onConfirm
              ? async (e: any) => {
                  setLoading(true)
                  try {
                    await onConfirm(e)
                  } catch (E) {
                    message.error(E.toString())
                  }
                  setLoading(false)
                }
              : undefined
          }
          {...props}
        >
          {React.cloneElement(children, { loading })}
        </Popconfirm>
      )}
    </Field>
  )
}
