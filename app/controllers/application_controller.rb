class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_filter :set_headers

  rescue_from ActionController::RoutingError, with: :redirect_form_not_found

  def raise_not_found!
    fail ActionController::RoutingError.new("No route matches #{params[:unmatched_route]}")
  end

  def redirect_form_not_found
    redirect_to '/'
  end

  def set_headers
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'POST, PUT, DELETE, GET, OPTIONS'
    headers['Access-Control-Request-Method'] = '*'
    headers['Access-Control-Allow-Headers'] = '*, Origin, X-Requested-With, Content-Type, Accept, Authorization, X-PARSE-MASTER-KEY, x-parse-master-key'
  end
end
